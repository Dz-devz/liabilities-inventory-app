import { Button } from "@/components/ui/button";
import { profileQuery } from "@/lib/api";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import logoTrackNStock from "/logo-white.png";

const Login = () => {
  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-center text-4xl"></h1>
      <img src={logoTrackNStock} className="mb-2" />
      <p className="text-lg break-words whitespace-pre-wrap text-profound text-center">
        Stay on top of your personal and business finances with our
        comprehensive tool. <br /> Track liabilities and manage your inventory
        all in one place.
      </p>
      <div className="flex mt-4 flex-row gap-2">
        <Button
          className="w-full max-w-sm py-2 px-4 mb-3 text-[#f2f4f6] rounded-lg transition duration-300 ease-in-out shadow-md"
          asChild
        >
          <a href="/api/login">Login</a>
        </Button>
        <Button
          className="w-full max-w-sm py-2 px-4 mb-3 text-[#f2f4f6] rounded-lg transition duration-300 ease-in-out shadow-md"
          asChild
        >
          <a href="/api/register">Register</a>
        </Button>
      </div>
    </div>
  );
};

const Component = () => {
  const { user } = Route.useRouteContext();
  if (!user) {
    return <Login />;
  }

  return <Outlet />;
};

// src/routes/_authenticated.tsx
export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context }) => {
    const queryClient = context.queryClient;

    try {
      const data = await queryClient.fetchQuery(profileQuery);
      return data;
    } catch (e) {
      return { user: null };
    }
  },
  component: Component,
});
