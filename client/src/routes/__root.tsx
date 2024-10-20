import { type QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import logo from "/logo-tracknstock.png";

type MyRouterContext = {
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: Root,
});

function NavLinks() {
  // const { isAuthenticated } = useKindeAuth();

  return (
    <div className="p-4 w-48 flex flex-col gap-2 border-r-2 border-border bg-secondary text-[#f2f4f6]">
      <img src={logo} className="w-[60px] h-[60px]" />
      <Link
        to="/"
        className="block py-2 px-3 rounded hover:bg-popover [&.active]:font-bold [&.active]:bg-popover"
      >
        Home
      </Link>
      <Link
        to="/about"
        className="block py-2 px-3 rounded hover:bg-popover [&.active]:font-bold [&.active]:bg-popover"
      >
        About
      </Link>
      <Link
        to="/profile"
        className="block py-2 px-3 rounded hover:bg-popover [&.active]:font-bold [&.active]:bg-popover"
      >
        Profile
      </Link>
      <Link
        to="/liabilities"
        className="block py-2 px-3 rounded hover:bg-popover [&.active]:font-bold [&.active]:bg-popover"
      >
        Liabilities
      </Link>
      <Link
        to="/create-liabilities"
        className="block py-2 px-3 rounded hover:bg-popover [&.active]:font-bold [&.active]:bg-popover"
      >
        Create Liability
      </Link>
      <div className="flex-grow"></div>

      <a
        className="block py-2 px-3 rounded hover:bg-popover"
        href="/api/logout [&.active]:bg-popover"
      >
        Logout
      </a>
      {/* {isAuthenticated ? (
        <a
          className="block py-2 px-3 rounded hover:bg-popover"
          href="/api/logout"
        >
          Logout
        </a>
      ) : (
        <a
          className="block py-2 px-3 rounded hover:bg-popover"
          href="/api/register"
        >
          Sign up
        </a>
      )} */}
    </div>
  );
}

function Root() {
  return (
    <div className="flex flex-col min-h-screen text-foreground bg-background">
      <div className="flex flex-grow">
        <NavLinks />
        <hr />
        <div className="flex-1 p-4">
          <Outlet />
          <TanStackRouterDevtools />
        </div>
      </div>
    </div>
  );
}
