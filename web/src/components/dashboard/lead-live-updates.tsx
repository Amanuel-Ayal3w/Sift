"use client";

import { useSubscription } from "@apollo/client/react";
import {
  LEAD_UPDATED_SUBSCRIPTION,
  type LeadUpdatedResult,
} from "@/lib/graphql/leads";
import { mergeLeadIntoCache } from "@/lib/graphql/merge-lead-cache";

/** Keeps dashboard lead lists in sync with `leadUpdated` from NestJS. */
export function LeadLiveUpdates() {
  useSubscription<LeadUpdatedResult>(LEAD_UPDATED_SUBSCRIPTION, {
    onData: ({ client, data }) => {
      const lead = data.data?.leadUpdated;
      if (lead) {
        mergeLeadIntoCache(client, lead);
      }
    },
  });
  return null;
}
