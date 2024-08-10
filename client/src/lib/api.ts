import { type ApiRoutes } from "@server/app";
import { queryOptions } from "@tanstack/react-query";
import { hc } from "hono/client";

const client = hc<ApiRoutes>("/");

export const api = client.api;

async function getCurrentProfile() {
  const res = await api.profile.$get();
  if (!res.ok) {
    throw new Error("Server error");
  }
  const data = await res.json();
  return data;
}

export const profileQuery = queryOptions({
  queryKey: ["get-current-profile"],
  queryFn: getCurrentProfile,
  staleTime: Infinity,
});
