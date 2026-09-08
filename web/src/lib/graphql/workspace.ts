import { gql } from "@apollo/client";

export const WORKSPACE_QUERY = gql`
  query Workspace {
    workspace {
      id
      name
      qualificationCriteria
      productDescription
      replyTone
      webhookUrl
    }
  }
`;

export const UPDATE_WORKSPACE_MUTATION = gql`
  mutation UpdateWorkspace($input: UpdateWorkspaceInput!) {
    updateWorkspace(input: $input) {
      id
      name
      qualificationCriteria
      productDescription
      replyTone
      webhookUrl
    }
  }
`;

export type Workspace = {
  id: string;
  name: string;
  qualificationCriteria: string;
  productDescription: string;
  replyTone: string | null;
  webhookUrl: string;
};

export type WorkspaceResult = { workspace: Workspace };

export type UpdateWorkspaceVars = {
  input: {
    name?: string;
    productDescription?: string;
    qualificationCriteria?: string;
    replyTone?: string;
  };
};
export type UpdateWorkspaceResult = { updateWorkspace: Workspace };
