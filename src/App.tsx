import { IconContext } from "@phosphor-icons/react";
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
  type RefetchQueryFilters,
} from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router";

import { ConfirmModalProvider } from "./components";
import { LAYOUTS } from "./constants/pages.ts";
import { MainLayout } from "./layouts/MainLayout";
import { TimeTrackerProvider } from "./store/context.tsx";

type RefreshQueriesMeta =
  | RefetchQueryFilters<string[]>
  | Array<RefetchQueryFilters<string[]>>;

declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: {
      refreshQueries?:
        | RefreshQueriesMeta
        | ((data: unknown) => RefreshQueriesMeta);
    };
  }
}

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    align?: "left" | "center" | "right";
  }
}

export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onSuccess: async (...args) => {
      const [, variables, , mutation] = args;
      const { meta = {} } = mutation;

      if (meta.refreshQueries) {
        const refreshQueries =
          typeof meta.refreshQueries === "function"
            ? meta.refreshQueries(variables)
            : meta.refreshQueries;

        if (Array.isArray(refreshQueries)) {
          await Promise.all(
            refreshQueries.map((query) => queryClient.refetchQueries(query)),
          );
        } else {
          await queryClient.refetchQueries(refreshQueries);
        }
      }
    },
  }),
});

const router = createBrowserRouter([
  {
    id: "__root",
    element: <MainLayout />,
    children: LAYOUTS.map((layout) => ({
      id: layout.id,
      element: <layout.layoutComponent />,
      children: layout.pages.map((page) => ({
        id: page.id,
        path: page.path + "/*",
        element: <page.component />,
        handle: page,
      })),
    })),
  },
]);

export function App() {
  return (
    <ConfirmModalProvider>
      <IconContext value={{ weight: "bold", size: 14 }}>
        <QueryClientProvider client={queryClient}>
          <TimeTrackerProvider>
            <RouterProvider router={router} />
          </TimeTrackerProvider>
        </QueryClientProvider>
      </IconContext>
    </ConfirmModalProvider>
  );
}
