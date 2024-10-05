import { createFileRoute, Link } from "@tanstack/react-router";
import logoTrackNStock from "/logo-white.png";
export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="flex flex-col justify-center items-center text-center p-6">
      <img src={logoTrackNStock} className="mb-2" />
      <p className="text-lg break-words whitespace-pre-wrap text-profound">
        Stay on top of your personal and business finances with our
        comprehensive tool. <br /> Track liabilities and manage your inventory
        all in one place.
      </p>

      <Link
        to="/create-liabilities"
        className="mt-8 px-8 py-4 bg-primary text-white font-bold rounded-lg transition duration-300 ease-in-out shadow-md hover:bg-blue-600"
      >
        <span className="text-foreground">Get Started</span>
      </Link>
    </div>
  );
}
