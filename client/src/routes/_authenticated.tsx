import { Button } from "@/components/ui/button";
import { profileQuery } from "@/lib/api";
import { createFileRoute, Outlet } from "@tanstack/react-router";

const Login = () => {
  return (
    <div className="flex flex-col items-center p-6">
      <p className="text-lg font-medium text-gray-800">
        Sign In or Create an Account
      </p>
      <p className="text-lg font-medium text-gray-800 mb-4">
        To access this page
      </p>
      <Button
        className="w-full max-w-sm py-2 px-4 mb-3 text-[#f2f4f6] bg-[#171d22] hover:bg-[#2f3b45] rounded-lg transition duration-300 ease-in-out shadow-md"
        asChild
      >
        <a href="/api/login">Login</a>
      </Button>
      <Button
        className="w-full max-w-sm py-2 px-4 mb-3 text-[#f2f4f6] bg-[#171d22] hover:bg-[#2f3b45] rounded-lg transition duration-300 ease-in-out shadow-md"
        asChild
      >
        <a href="/api/register">Register</a>
      </Button>
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
