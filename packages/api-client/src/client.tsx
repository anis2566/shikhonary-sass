"use client";

import { useMemo } from "react";
import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";
import {
  createTRPCClient,
  httpBatchStreamLink,
  loggerLink,
} from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import SuperJSON from "superjson";
import type { AppRouter } from "@workspace/api";
import { createQueryClient } from "./query-client";

let clientQueryClientSingleton: QueryClient | undefined = undefined;
const getQueryClient = () => {
  if (typeof window === "undefined") {
    return createQueryClient();
  } else {
    return (clientQueryClientSingleton ??= createQueryClient());
  }
};

export const { useTRPC, TRPCProvider } = createTRPCContext<AppRouter>();

export function TRPCReactProvider(props: {
  children: React.ReactNode;
  baseUrl: string;
}) {
  const queryClient = getQueryClient();

  const trpcClient = useMemo(
    () =>
      createTRPCClient<AppRouter>({
        links: [
          loggerLink({
            enabled: (op) =>
              process.env.NODE_ENV === "development" ||
              (op.direction === "down" && op.result instanceof Error),
          }),
          httpBatchStreamLink({
            transformer: SuperJSON,
            url: props.baseUrl + "/api/trpc",
            headers() {
              const headers = new Headers();
              headers.set("x-trpc-source", "nextjs-react");
              return headers;
            },
          }),
        ],
      }),
    [props.baseUrl],
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {props.children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}
