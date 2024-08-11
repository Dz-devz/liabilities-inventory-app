import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { profileQuery } from "../../lib/api";

export const Route = createFileRoute("/_authenticated/profile")({
  component: Profile,
});

function Profile() {
  const { isPending, error, data } = useQuery(profileQuery);

  if (isPending) return "Loading...";
  if (error) return "Not Logged In";

  return (
    <div className="p-2">
      <p>{data.user.given_name}</p>
    </div>
  );
}
