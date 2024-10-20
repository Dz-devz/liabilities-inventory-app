import { type ApiRoutes } from "@server/app";
import { CreateBudget, CreateLiabilities } from "@server/types";
import { queryOptions } from "@tanstack/react-query";
import { hc } from "hono/client";

// where you can call all api in the server using hono/client
// also all the queries

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

export const liabilitiesHistoryQuery = queryOptions({
  queryKey: ["get-liabilities-history"],
  queryFn: getLiabilitiesHistoryDate,
  staleTime: 60 * 60 * 1000,
});

export const drainedQuery = queryOptions({
  queryKey: ["get-total-drained"],
  queryFn: getTotalDrained,
});

export const budgetQuery = queryOptions({
  queryKey: ["get-budget"],
  queryFn: getBudget,
  staleTime: 60 * 60 * 1000,
});

export const limitQuery = queryOptions({
  queryKey: ["get-limit"],
  queryFn: getLimit,
});

export const availableMonthsQuery = queryOptions({
  queryKey: ["get-available-months"],
  queryFn: getAvailableMonths,
});

// export const singleBudgetQuery = (id: string) =>
//   queryOptions({
//     queryKey: ["get-single-budget", id],
//     queryFn: () => getSingleLiabilities({ id: id }),
//     staleTime: 60 * 60 * 1000,
//   });

export async function getAvailableMonths() {
  const res = await api.liabilities["available-months"].$get();
  if (!res.ok) {
    throw new Error("Server error");
  }
  const data = await res.json();
  return data;
}

export async function getLiabilitiesHistoryDate() {
  const res = await api.liabilities["liabilities-history-date"].$get();
  if (!res.ok) {
    throw new Error("Server error");
  }
  const data = await res.json();
  return data;
}

export async function updateBudget({
  id,
  limit,
}: {
  id: string;
  limit: string;
}) {
  const res = await api.budget[":id"].$put({
    param: { id: id },
    json: { limit: limit },
  });

  if (!res.ok) {
    throw new Error("Server Error");
  }

  const data = await res.json();
  return data;
}

export async function getBudget() {
  const res = await api.budget.$get();
  if (!res.ok) {
    throw new Error("Server error");
  }
  const data = await res.json();
  return data;
}

// export async function getSingleBudget({ id }: { id: string }) {
//   const res = await api.budget[":id"].$get({
//     param: { id: id.toString() },
//   });

//   if (!res.ok) {
//     throw new Error("Server error");
//   }
//   const data = await res.json();
//   return data;
// }

export async function getLimit() {
  const res = await api.budget["limit"].$get();
  if (!res.ok) {
    throw new Error("Server error");
  }
  const data = await res.json();
  return data;
}

export async function getSingleLiabilities({ id }: { id: string }) {
  const res = await api.liabilities[":id{[0-9]+}"].$get({
    param: { id: id.toString() },
  });

  if (!res.ok) {
    throw new Error("Server Error");
  }
  const data = await res.json();
  return data;
}

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

export async function createBudget({ value }: { value: CreateBudget }) {
  const res = await api.budget.$post({ json: value });
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
