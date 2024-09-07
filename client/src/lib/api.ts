import { type ApiRoutes } from "@server/app";
import { CreateLiabilities } from "@server/types";
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

export const liabilitiesQuery = queryOptions({
  queryKey: ["get-all-liabilities"],
  queryFn: getAllDrained,
  staleTime: 60 * 60 * 1000,
});

export const drainedQuery = queryOptions({
  queryKey: ["get-total-drained"],
  queryFn: getTotalDrained,
});

export async function getAllDrained() {
  const res = await api.liabilities.$get();
  if (!res.ok) {
    throw new Error("Server error");
  }
  const data = await res.json();
  return data;
}

export async function getTotalDrained() {
  const res = await api.liabilities["total-drained"].$get();
  if (!res.ok) {
    throw new Error("Server error");
  }
  const data = await res.json();
  return data;
}

export async function createLiabilities({
  value,
}: {
  value: CreateLiabilities;
}) {
  const res = await api.liabilities.$post({ json: value });
  if (!res.ok) {
    throw new Error("Server Error");
  }
  const recentLiabilities = await res.json();
  return recentLiabilities;
}

export async function deleteLiabilities(ids: number[]) {
  const res = await api.liabilities.$delete({
    json: { ids },
  });

  if (!res.ok) {
    throw new Error("server error");
  }

  return res.json();
}
