"use client";

import { ApolloLink, HttpLink } from "@apollo/client";
import {
  ApolloClient,
  ApolloNextAppProvider,
  InMemoryCache,
} from "@apollo/client-integration-nextjs";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { isSubscriptionOperation } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";

function graphqlWsUrl(): string {
  if (process.env.NEXT_PUBLIC_GRAPHQL_WS_URL) {
    return process.env.NEXT_PUBLIC_GRAPHQL_WS_URL;
  }
  const http =
    process.env.NEXT_PUBLIC_GRAPHQL_URL ?? "http://localhost:3001/graphql";
  return http.replace(/^http/, "ws");
}

function makeClient() {
  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
    credentials: "include",
    fetchOptions: { cache: "no-store" },
  });

  if (typeof window === "undefined") {
    return new ApolloClient({
      cache: new InMemoryCache(),
      link: httpLink,
    });
  }

  const wsLink = new GraphQLWsLink(
    createClient({
      url: graphqlWsUrl(),
    }),
  );

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.split(
      ({ query }) => isSubscriptionOperation(query),
      wsLink,
      httpLink,
    ),
  });
}

export function ApolloWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
