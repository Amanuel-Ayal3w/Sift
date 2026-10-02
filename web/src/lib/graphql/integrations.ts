import { gql } from "@apollo/client";

export const INTEGRATIONS_QUERY = gql`
  query Integrations {
    integrations {
      webhookUrl
      channels {
        name
        status
      }
      mailboxAddress
      repliesEnabled
      inboxConnected
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
  mailboxAddress: string | null;
  repliesEnabled: boolean;
  inboxConnected: boolean;
};

export type IntegrationsResult = { integrations: IntegrationsPayload };

export const CONNECT_GMAIL_MUTATION = gql`
  mutation ConnectGmail($input: ConnectGmailInput!) {
    connectGmail(input: $input) {
      mailboxAddress
      repliesEnabled
      inboxConnected
      channels {
        name
        status
      }
    }
  }
`;

export type ConnectGmailResult = { connectGmail: IntegrationsPayload };
export type ConnectGmailVars = { input: { email: string; appPassword: string } };
