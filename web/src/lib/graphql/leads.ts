import { gql } from "@apollo/client";

export const LEADS_QUERY = gql`
  query Leads($status: LeadStatus, $limit: Int, $offset: Int) {
    leads(status: $status, limit: $limit, offset: $offset) {
      id
      name
      email
      company
      source
      score
      tier
      status
      reasoning
      draftReply
      createdAt
    }
  }
`;

export const UPDATE_LEAD_STATUS_MUTATION = gql`
  mutation UpdateLeadStatus($id: ID!, $status: LeadStatus!) {
    updateLeadStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

export type LeadStatus = "NEW" | "REVIEWED" | "CONTACTED" | "ARCHIVED";
export type LeadTier = "HOT" | "WARM" | "COLD";

export type Lead = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  source: string | null;
  score: number;
  tier: LeadTier;
  status: LeadStatus;
  reasoning: string;
  draftReply: string;
  createdAt: string;
};

export type LeadsResult = { leads: Lead[] };
export type LeadsVars = {
  status?: LeadStatus;
  limit?: number;
  offset?: number;
};

export type UpdateLeadStatusResult = {
  updateLeadStatus: { id: string; status: LeadStatus };
};
export type UpdateLeadStatusVars = { id: string; status: LeadStatus };
