import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <div className="flex justify-center items-center">
      <div className="about-section p-6 shadow-md rounded-lg max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center text-[#04FA04]">
          About This App
        </h2>
        <p className="mb-4">
          Welcome to the Personal Liabilities and Inventory System! This app is
          designed to help you manage and track both your personal liabilities
          and inventory with ease. Whether you're keeping tabs on your personal
          expenses or managing an inventory, our system allows you to:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>
            <strong>Track Personal Liabilities:</strong> Easily record and
            manage your financial obligations.
          </li>
          <li>
            <strong>Manage Inventory:</strong> Keep a detailed list of your
            inventory items, complete with values and details.
          </li>
          <li>
            <strong>Calculate Total Liabilities:</strong> Automatically compute
            the total liabilities from both your personal and inventory records,
            giving you a clear picture of your financial standing.
          </li>
        </ul>
        <p>
          Our goal is to provide you with a comprehensive tool to stay organized
          and informed about your liabilities, ensuring you have all the
          information you need to make sound financial decisions.
        </p>
      </div>
    </div>
  );
}
