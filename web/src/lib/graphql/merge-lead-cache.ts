import type { ApolloClient } from "@apollo/client";
import {
  LEADS_QUERY,
  type Lead,
  type LeadStatus,
  type LeadsResult,
  type LeadsVars,
} from "@/lib/graphql/leads";

function mergeLeadList(
  leads: Lead[],
  incoming: Lead,
  statusFilter?: LeadStatus,
): Lead[] {
  const matches = !statusFilter || incoming.status === statusFilter;
  const index = leads.findIndex((lead) => lead.id === incoming.id);
  if (index === -1) {
    return matches ? [incoming, ...leads] : leads;
  }
  if (!matches) {
    return leads.filter((lead) => lead.id !== incoming.id);
  }
  const next = leads.slice();
  next[index] = incoming;
  return next;
}

const CACHE_VARS: LeadsVars[] = [
  {},
  { status: "NEW" },
  { status: "NEW", limit: 200 },
  { status: "NEW", limit: 50 },
  { status: "REVIEWED" },
  { status: "CONTACTED" },
  { status: "ARCHIVED" },
  { limit: 50, offset: 0 },
];

/** Writes a live lead into every cached `leads` query the dashboard uses. */
export function mergeLeadIntoCache(
  client: ApolloClient,
  incoming: Lead,
): void {
  for (const variables of CACHE_VARS) {
    client.cache.updateQuery<LeadsResult, LeadsVars>(
      { query: LEADS_QUERY, variables },
      (data) => {
        if (!data) {
          return data;
        }
        return {
          leads: mergeLeadList(data.leads, incoming, variables.status),
        };
      },
    );
  }
}
