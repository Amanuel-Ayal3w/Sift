from typing import Literal

from pydantic import BaseModel, Field


class LeadInput(BaseModel):
    full_name: str
    email: str
    company_name: str | None = None
    company_domain: str | None = None
    job_title: str | None = None
    message: str = Field(description="The inbound inquiry text from the lead")
    source: str | None = None


class OrgContext(BaseModel):
    org_name: str
    product_description: str
    qualification_criteria: list[str] = Field(
        description="Org-specific criteria used to judge whether a lead is a good fit"
    )
    reply_tone: str | None = Field(
        default=None, description="Desired tone for the drafted reply, e.g. 'friendly and concise'"
    )


class QualifyRequest(BaseModel):
    lead: LeadInput
    org: OrgContext


class LeadQualification(BaseModel):
    fit_score: int = Field(ge=0, le=100, description="How well the lead fits the org's ICP, 0-100")
    qualification: Literal["qualified", "unqualified", "needs_review"]
    reasoning: str = Field(description="Short explanation grounded in the org's qualification criteria")
    key_signals: list[str] = Field(description="Specific signals from the lead that drove the score")
    draft_reply: str = Field(description="A personalized reply ready to send to the lead")


class QualifyResponse(BaseModel):
    result: LeadQualification
    model: str
