import { gql } from "@apollo/client";

export const LEADS_QUERY = gql`
  query Leads($status: LeadStatus, $limit: Int, $offset: Int) {
    leads(status: $status, limit: $limit, offset: $offset) {
      id
      name
      email
      company
      source
      message
      score
      tier
      status
      reasoning
      draftReply
      createdAt
    }
  }
`;

export const SEND_LEAD_REPLY_MUTATION = gql`
  mutation SendLeadReply($id: ID!) {
    sendLeadReply(id: $id) {
      id
      status
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

export const LEAD_UPDATED_SUBSCRIPTION = gql`
  subscription LeadUpdated {
    leadUpdated {
      id
      name
      email
      company
      source
      message
      score
      tier
      status
      reasoning
      draftReply
      createdAt
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
  message: string;
  score: number | null;
  tier: LeadTier | null;
  status: LeadStatus;
  reasoning: string | null;
  draftReply: string | null;
  createdAt: string;
};

export type LeadsResult = { leads: Lead[] };
export type LeadsVars = {
  status?: LeadStatus;
  limit?: number;
  offset?: number;
};

export type SendLeadReplyResult = {
  sendLeadReply: { id: string; status: LeadStatus };
};
export type SendLeadReplyVars = { id: string };

export type UpdateLeadStatusResult = {
  updateLeadStatus: { id: string; status: LeadStatus };
};
export type UpdateLeadStatusVars = { id: string; status: LeadStatus };

export type LeadUpdatedResult = { leadUpdated: Lead };
