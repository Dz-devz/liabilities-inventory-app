import { createRootRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: Root,
});

function NavLinks() {
  return (
    <div className="p-2 flex gap-2">
      <Link to="/" className="[&.active]:font-bold">
        Home
      </Link>{" "}
      <Link to="/about" className="[&.active]:font-bold">
        About
      </Link>
      <Link to="/profile" className="[&.active]:font-bold">
        Profile
      </Link>
      <Link to="/liabilities" className="[&.active]:font-bold">
        Liabilities
      </Link>{" "}
      <Link to="/create-liabilities" className="[&.active]:font-bold">
        Create Liabilities
      </Link>
    </div>
  );
}

function Root() {
  return (
    <>
      <NavLinks />
      <hr />
      <Outlet />
      {/* <TanStackRouterDevtools /> */}
    </>
  );
}
