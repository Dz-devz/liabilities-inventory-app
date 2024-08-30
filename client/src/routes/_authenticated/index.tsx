import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/")({
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-popover text-center p-6">
      <h1 className="text-4xl font-bold mb-4">
        Liabilities Tracker & Inventory System
      </h1>
      <p className="text-lg text-accent mb-6">
        Stay on top of your personal and business finances with our
        comprehensive tool. Track liabilities and manage your inventory all in
        one place.
      </p>

      <div className="flex flex-col space-y-4">
        <section className="bg- p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-2 ">Liabilities Tracker</h2>
          <p className="text-secondary">
            Monitor and manage your financial obligations with ease. Our
            Liabilities Tracker helps you keep track of all your debts and
            payments, ensuring you never miss a due date.
          </p>
        </section>

        <section className="p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-2">Inventory System</h2>
          <p className="text-secondary">
            Efficiently manage your inventory with our system. Track stock
            levels, categorize items, and generate reports to help you make
            informed decisions.
          </p>
        </section>

        <Link
          href="/create-liabilities"
          className="mt-8 px-8 py-4 bg-primary text-white font-bold rounded-lg hover:bg-primary-foreground transition duration-300"
        >
          <span className="text-foreground">Get Started</span>
        </Link>
      </div>
    </div>
  );
}

export default Home;
