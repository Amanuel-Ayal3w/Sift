from openai import OpenAI

from app.config import settings
from app.schemas import CompanyEnrichment, LeadQualification, QualifyRequest
from app.services.enrichment import enrich_company, resolve_company_domain

SYSTEM_PROMPT = """You are a B2B sales development rep triaging inbound leads for a SaaS company.
Given a lead's details and the org's product context and qualification criteria, you:
1. Score how well the lead fits the org's ideal customer profile (0-100).
2. Decide whether the lead is "qualified", "unqualified", or "needs_review" (ambiguous, missing
   key info, or borderline fit).
3. Ground your reasoning in the specific qualification criteria provided — cite which ones are
   met or unmet. If company enrichment data is provided, weigh it alongside what the lead said.
4. Draft a personalized reply to the lead that reflects the qualification outcome: qualified
   leads get a reply that moves them toward a next step (e.g. booking a call); unqualified or
   needs_review leads get a polite, honest reply appropriate to that outcome.
Do not invent facts about the lead or company that weren't given to you."""


def _format_enrichment(enrichment: CompanyEnrichment | None) -> str:
    if not enrichment:
        return ""
    facts = []
    if enrichment.industry:
        facts.append(f"Industry: {enrichment.industry}")
    if enrichment.employee_count is not None:
        facts.append(f"Employees: {enrichment.employee_count}")
    elif enrichment.employee_range:
        facts.append(f"Employee range: {enrichment.employee_range}")
    if enrichment.estimated_annual_revenue:
        facts.append(f"Estimated annual revenue: {enrichment.estimated_annual_revenue}")
    if enrichment.description:
        facts.append(f"About: {enrichment.description}")
    if not facts:
        return ""
    return "\n\n# Company enrichment (from Clearbit)\n" + "\n".join(facts)


def build_user_prompt(request: QualifyRequest, enrichment: CompanyEnrichment | None) -> str:
    lead = request.lead
    org = request.org
    lead_details = [
        f"Name: {lead.full_name}",
        f"Email: {lead.email}",
        f"Company: {lead.company_name or 'unknown'}",
        f"Company domain: {lead.company_domain or 'unknown'}",
        f"Job title: {lead.job_title or 'unknown'}",
        f"Source: {lead.source or 'unknown'}",
        f"Message: {lead.message}",
    ]
    criteria = "\n".join(f"- {c}" for c in org.qualification_criteria)
    return f"""# Org
Name: {org.org_name}
Product: {org.product_description}
Reply tone: {org.reply_tone or "professional and warm"}

# Qualification criteria
{criteria}

# Lead
{chr(10).join(lead_details)}{_format_enrichment(enrichment)}"""


def run_structured_qualification(client: OpenAI, user_prompt: str) -> LeadQualification:
    response = client.responses.parse(
        model=settings.openai_model,
        input=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ],
        text_format=LeadQualification,
    )
    return response.output_parsed


def qualify_lead(request: QualifyRequest) -> tuple[LeadQualification, CompanyEnrichment | None]:
    enrichment = enrich_company(
        resolve_company_domain(request.lead.company_domain, request.lead.email)
    )
    client = OpenAI(api_key=settings.openai_api_key)
    user_prompt = build_user_prompt(request, enrichment)
    result = run_structured_qualification(client, user_prompt)
    return result, enrichment
