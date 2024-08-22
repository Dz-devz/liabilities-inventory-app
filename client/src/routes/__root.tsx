import Footer from "@/components/ui/footer";
import { type QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from "@tanstack/react-router";

type MyRouterContext = {
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: Root,
});

function NavLinks() {
  return (
    <div className="p-4 w-64 flex flex-col gap-2 border-r-[1px] border-gray-50 text-[#EEEEEE]">
      <Link
        to="/"
        className="block py-2 px-3 rounded hover:bg-[#04FA04] [&.active]:font-bold"
      >
        Home
      </Link>
      <Link
        to="/about"
        className="block py-2 px-3 rounded hover:bg-[#04FA04] [&.active]:font-bold"
      >
        About
      </Link>
      <Link
        to="/profile"
        className="block py-2 px-3 rounded hover:bg-[#04FA04] [&.active]:font-bold"
      >
        Profile
      </Link>
      <Link
        to="/liabilities"
        className="block py-2 px-3 rounded hover:bg-[#04FA04] [&.active]:font-bold"
      >
        Liabilities
      </Link>
      <Link
        to="/create-liabilities"
        className="block py-2 px-3 rounded hover:bg-[#04FA04] [&.active]:font-bold"
      >
        Create Liabilities
      </Link>
    </div>
  );
}

function Root() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-grow">
        <NavLinks />
        <hr />
        <div className="flex-1 p-4">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
}
