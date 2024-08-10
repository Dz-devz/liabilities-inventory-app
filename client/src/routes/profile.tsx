import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "../lib/api";

export const Route = createFileRoute("/profile")({
  component: Profile,
});

async function getCurrentProfile() {
  const res = await api.profile.$get();
  if (!res.ok) {
    throw new Error("Server error");
  }
  const data = await res.json();
  return data;
}

function Profile() {
  const { isPending, error, data } = useQuery({
    queryKey: ["get-current-profile"],
    queryFn: getCurrentProfile,
  });

  if (isPending) return "Loading...";
  if (error) return "Not Logged In";

  return (
    <div className="p-2">
      <p>{data.user.given_name}</p>
    </div>
  );
}
