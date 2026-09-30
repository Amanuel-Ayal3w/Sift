import logging

import httpx

from app.config import settings
from app.schemas import CompanyEnrichment

logger = logging.getLogger(__name__)

CLEARBIT_COMPANY_URL = "https://company.clearbit.com/v2/companies/find"

CONSUMER_EMAIL_DOMAINS = frozenset(
    {
        "gmail.com",
        "googlemail.com",
        "yahoo.com",
        "hotmail.com",
        "outlook.com",
        "live.com",
        "icloud.com",
        "me.com",
        "aol.com",
        "proton.me",
        "protonmail.com",
    }
)


def domain_from_email(email: str | None) -> str | None:
    if not email or "@" not in email:
        return None
    domain = email.rsplit("@", 1)[-1].strip().lower()
    return domain or None


def resolve_company_domain(company_domain: str | None, email: str | None) -> str | None:
    """Prefer an explicit company domain; otherwise use the email host unless
    it is a consumer mailbox provider (gmail, etc.)."""
    if company_domain and company_domain.strip():
        return company_domain.strip().lower()
    derived = domain_from_email(email)
    if derived and derived not in CONSUMER_EMAIL_DOMAINS:
        return derived
    return None


def enrich_company(domain: str | None) -> CompanyEnrichment | None:
    """Look up firmographic data for a company domain.

    Never raises: any missing config, timeout, or provider error just means
    the agent proceeds without enrichment rather than failing the whole
    qualification.
    """
    if not domain or not settings.enrichment_api_key:
        return None

    if settings.enrichment_provider != "clearbit":
        logger.warning("Unsupported enrichment provider: %s", settings.enrichment_provider)
        return None

    try:
        response = httpx.get(
            CLEARBIT_COMPANY_URL,
            params={"domain": domain},
            headers={"Authorization": f"Bearer {settings.enrichment_api_key}"},
            timeout=settings.enrichment_timeout_seconds,
        )
        response.raise_for_status()
        data = response.json()
    except httpx.HTTPStatusError as exc:
        if exc.response.status_code != 404:
            logger.warning("Enrichment lookup failed for domain %s: %s", domain, exc)
        return None
    except (httpx.HTTPError, ValueError) as exc:
        logger.warning("Enrichment lookup failed for domain %s: %s", domain, exc)
        return None

    category = data.get("category") or {}
    metrics = data.get("metrics") or {}
    return CompanyEnrichment(
        industry=category.get("industry"),
        employee_count=metrics.get("employees"),
        employee_range=metrics.get("employeesRange"),
        estimated_annual_revenue=metrics.get("estimatedAnnualRevenue"),
        description=data.get("description"),
    )
