import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { RouterProvider, createRouter } from "@tanstack/react-router";

const queryClient = new QueryClient();

import { KindeProvider } from "@kinde-oss/kinde-auth-react";
import { routeTree } from "./routeTree.gen";

const router = createRouter({ routeTree, context: { queryClient } });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <KindeProvider
      clientId="b27a29547df94493a9a7b82a1dc3551d"
      domain="https://dzdev.kinde.com"
      logoutUri="http://localhost:5173"
      redirectUri="http://localhost:5173"
    >
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </KindeProvider>
  </React.StrictMode>
);
