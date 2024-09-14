import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
    <div className="p-4 space-y-4">
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage
            src={data.user.picture || "https://github.com/shadcn.png"}
            alt={data.user.given_name}
          />
          <AvatarFallback>
            {data.user.given_name?.charAt(0)}
            {data.user.family_name?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-2xl font-semibold">
            {data.user.given_name} {data.user.family_name}
          </p>
          <p className="text-sm">{data.user.email}</p>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-bold">Profile Details</h2>
        <ul className="space-y-1">
          <li>
            <strong>Email:</strong> {data.user.email}
          </li>
        </ul>
      </div>
      <div>
        <h2 className="text-xl font-bold">Liability Stats</h2>
        <ul className="space-y-1">
          <li>
            <strong>Total Liabilities:</strong> $X,XXX
          </li>
          <li>
            <strong>Remaining Budget:</strong> $X,XXX
          </li>
        </ul>
      </div>
    </div>
  );
}
