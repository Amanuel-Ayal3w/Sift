import { gql } from "@apollo/client";

export const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      role
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      user {
        id
        email
        role
      }
    }
  }
`;

export const SIGNUP_MUTATION = gql`
  mutation Signup($input: SignupInput!) {
    signup(input: $input) {
      user {
        id
        email
        role
      }
    }
  }
`;

export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

export type AuthUser = {
  id: string;
  email: string;
  role: string;
};

export type AuthPayloadResult = {
  user: AuthUser;
};

export type MeResult = { me: AuthUser };

export type LoginResult = { login: AuthPayloadResult };
export type LoginVars = { input: { email: string; password: string } };

export type SignupResult = { signup: AuthPayloadResult };
export type SignupVars = {
  input: { companyName: string; email: string; password: string };
};

export type LogoutResult = { logout: boolean };
