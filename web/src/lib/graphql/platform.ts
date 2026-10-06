import { gql } from "@apollo/client";

export const PLATFORM_LOGIN_MUTATION = gql`
  mutation PlatformLogin($input: LoginInput!) {
    platformLogin(input: $input) {
      admin {
        id
        email
      }
    }
  }
`;

export const PLATFORM_LOGOUT_MUTATION = gql`
  mutation PlatformLogout {
    platformLogout
  }
`;

export const PLATFORM_ME_QUERY = gql`
  query PlatformMe {
    platformMe {
      id
      email
    }
  }
`;

export const PLATFORM_METRICS_QUERY = gql`
  query PlatformMetrics {
    platformMetrics {
      mrr
      arr
      payingWorkspaces
      trialWorkspaces
      averageScore
      mailboxCount
      plans {
        plan
        workspaces
        monthlyRevenue
      }
      days {
        date
        leads
        hotLeads
        warmLeads
        coldLeads
        workspaces
        users
      }
    }
  }
`;

export const PLATFORM_OVERVIEW_QUERY = gql`
  query PlatformOverview {
    platformOverview {
      workspaceCount
      userCount
      leadCount
      suspendedWorkspaceCount
      hotLeads
      warmLeads
      coldLeads
      newLeads
      reviewedLeads
      contactedLeads
      archivedLeads
    }
  }
`;

export const PLATFORM_WORKSPACES_QUERY = gql`
  query PlatformWorkspaces {
    platformWorkspaces {
      id
      name
      ownerEmail
      userCount
      leadCount
      gmailConnected
      plan
      suspended
      createdAt
    }
  }
`;

export const PLATFORM_USERS_QUERY = gql`
  query PlatformUsers {
    platformUsers {
      id
      email
      role
      workspaceId
      workspaceName
      createdAt
    }
  }
`;

export const SET_WORKSPACE_PLAN_MUTATION = gql`
  mutation SetWorkspacePlan($id: ID!, $plan: BillingPlan!) {
    setWorkspacePlan(id: $id, plan: $plan) {
      id
      plan
    }
  }
`;

export const SET_WORKSPACE_SUSPENDED_MUTATION = gql`
  mutation SetWorkspaceSuspended($id: ID!, $suspended: Boolean!) {
    setWorkspaceSuspended(id: $id, suspended: $suspended) {
      id
      suspended
    }
  }
`;

export type PlatformAdmin = {
  id: string;
  email: string;
};

export type PlatformOverview = {
  workspaceCount: number;
  userCount: number;
  leadCount: number;
  suspendedWorkspaceCount: number;
  hotLeads: number;
  warmLeads: number;
  coldLeads: number;
  newLeads: number;
  reviewedLeads: number;
  contactedLeads: number;
  archivedLeads: number;
};

export type BillingPlan = "TRIAL" | "STARTER" | "GROWTH";

export type PlatformDay = {
  date: string;
  leads: number;
  hotLeads: number;
  warmLeads: number;
  coldLeads: number;
  workspaces: number;
  users: number;
};

export type PlatformPlanStat = {
  plan: BillingPlan;
  workspaces: number;
  monthlyRevenue: number;
};

export type PlatformMetrics = {
  mrr: number;
  arr: number;
  payingWorkspaces: number;
  trialWorkspaces: number;
  averageScore: number;
  mailboxCount: number;
  plans: PlatformPlanStat[];
  days: PlatformDay[];
};

export type PlatformWorkspace = {
  id: string;
  name: string;
  ownerEmail: string | null;
  userCount: number;
  leadCount: number;
  gmailConnected: boolean;
  plan: BillingPlan;
  suspended: boolean;
  createdAt: string;
};

export type PlatformUser = {
  id: string;
  email: string;
  role: string;
  workspaceId: string;
  workspaceName: string;
  createdAt: string;
};

export type PlatformLoginResult = {
  platformLogin: { admin: PlatformAdmin };
};
export type PlatformLoginVars = {
  input: { email: string; password: string };
};

export type PlatformLogoutResult = { platformLogout: boolean };

export type PlatformMeResult = { platformMe: PlatformAdmin };

export type PlatformOverviewResult = { platformOverview: PlatformOverview };

export type PlatformMetricsResult = { platformMetrics: PlatformMetrics };

export type PlatformWorkspacesResult = {
  platformWorkspaces: PlatformWorkspace[];
};

export type PlatformUsersResult = { platformUsers: PlatformUser[] };

export type SetWorkspacePlanResult = {
  setWorkspacePlan: { id: string; plan: BillingPlan };
};
export type SetWorkspacePlanVars = { id: string; plan: BillingPlan };

export type SetWorkspaceSuspendedResult = {
  setWorkspaceSuspended: { id: string; suspended: boolean };
};
export type SetWorkspaceSuspendedVars = { id: string; suspended: boolean };
