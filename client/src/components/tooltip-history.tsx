import LiabilitiesHistory from "@/routes/liabilities-history";
import { Link } from "@tanstack/react-router";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export default function tooltipHistory() {
  const date: Date = new Date();
  date.setMonth(date.getMonth() - 1); // Subtract one month
  const pastMonth = date.toLocaleString("default", { month: "long" });
  return (
    <TooltipProvider>
      <Tooltip>
        <Link to="/liabilities-history">
          <TooltipTrigger>
            <div
              className="w-50 h-30 p-2 flex items-center justify-center rounded-md transition-all duration-200 cursor-pointer"
              //gradient style
              style={{
                background:
                  "linear-gradient(to right, rgba(255, 255, 255, 0.9), rgba(230, 230, 230, 0.9))",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.15)",
                border: "1px solid rgba(200, 200, 200, 0.5)",
              }}
            >
              <div className="flex flex-col items-center">
                <span
                  className="text-3xl font-bold text-gray-800 mb-1"
                  style={{
                    textShadow: "1px 1px 2px rgba(255, 255, 255, 0.7)",
                  }}
                >
                  📅
                </span>
                <span
                  className="font-semibold text-gray-900 text-lg"
                  style={{ letterSpacing: "0.5px" }}
                >
                  {pastMonth} History
                </span>
              </div>
            </div>
          </TooltipTrigger>
        </Link>
        <TooltipContent className="w-100 h-100 p-0">
          <LiabilitiesHistory isTooltip={true} />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
