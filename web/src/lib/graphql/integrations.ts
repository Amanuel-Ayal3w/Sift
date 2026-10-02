import { gql } from "@apollo/client";

export const INTEGRATIONS_QUERY = gql`
  query Integrations {
    integrations {
      webhookUrl
      channels {
        name
        status
      }
    }
  }
`;

export type Channel = {
  name: string;
  status: string;
};

export type IntegrationsPayload = {
  webhookUrl: string;
  channels: Channel[];
};

export type IntegrationsResult = { integrations: IntegrationsPayload };
