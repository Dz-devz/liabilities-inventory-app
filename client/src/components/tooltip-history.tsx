import LiabilitiesHistory from "@/routes/liabilities-history"; // Adjust path if needed
import { Link } from "@tanstack/react-router";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

type Liability = {
  id: number;
  date: string;
  userId: string;
  title: string;
  amount: string;
  createdAt: string | null;
};
interface TooltipHistoryProps {
  availableMonths: string[];
  liabilitiesHistory: { month: string; liabilities: Liability[] }[];
}

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const TooltipHistory: React.FC<TooltipHistoryProps> = ({
  availableMonths,
  liabilitiesHistory,
}) => {
  return (
    <TooltipProvider>
      <div className="flex flex-row gap-4 m-2">
        {availableMonths.map((month, idx) => {
          const [monthNumber, year] = month.split(" ").map(Number);
          const monthName = monthNames[monthNumber - 1];

          // Find the liabilities for the current month
          const currentMonthLiabilities = liabilitiesHistory.find(
            (history) => history.month === `${monthName} ${year}`
          )?.liabilities;

          // Debugging: Log the current month and corresponding liabilities
          console.log(`Month: ${monthName} ${year}`, currentMonthLiabilities);

          return (
            <Tooltip key={idx}>
              <Link to={`/liabilities-history?month=${month}`}>
                <TooltipTrigger>
                  <div
                    className="w-50 h-30 p-2 flex items-center justify-center rounded-md transition-all duration-200 cursor-pointer"
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
                        {monthName} {year} History
                      </span>
                    </div>
                  </div>
                </TooltipTrigger>
              </Link>
              <TooltipContent className="w-100 h-100 p-0">
                {/* Pass only the liabilities for the current month */}
                <LiabilitiesHistory
                  isTooltip={true}
                  liabilities={currentMonthLiabilities || []}
                />
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
};

export default TooltipHistory;
