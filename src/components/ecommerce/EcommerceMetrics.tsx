// components/dashboard/EcommerceMetrics.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  ArrowDownIcon,
  ArrowUpIcon,
  CheckCircleIcon,
  BoxIconLine,
  CloseIcon,
  GroupIcon,
} from "../../icons";

import Badge from "../ui/badge/Badge";

export default function EcommerceMetrics() {
  const [customerCount, setCustomerCount] = useState(0);
  const [quotationCount, setQuotationCount] = useState(0);
  const [dealYes, setDealYes] = useState(0);
  const [dealNo, setDealNo] = useState(0);
  const [todaysFollowups, setTodaysFollowups] = useState(0);

  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const custRes = await axios.get(`${BASE_URL}/customers`);
        setCustomerCount(custRes.data?.length || 0);

        const quoteRes = await axios.get(`${BASE_URL}/quotation-tracking`);
        setQuotationCount(quoteRes.data?.length || 0);

        const data = quoteRes.data || [];
        setDealYes(data.filter((q) => q.is_deal_finalised === "Yes").length);
        setDealNo(data.filter((q) => q.is_deal_finalised === "No").length);

        // 🔹 Today's Followups
        const followupsRes = await axios.get(`${BASE_URL}/quotation_followups`);
        const followups = followupsRes.data || [];

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const countToday = followups.filter(f => {
          const fDate = f.next_followup_date ? new Date(f.next_followup_date) : null;
          if (!fDate) return false;
          fDate.setHours(0, 0, 0, 0);
          return fDate.getTime() === today.getTime();
        }).length;

        setTodaysFollowups(countToday);

      } catch (error) {
        console.error("Error fetching dashboard metrics:", error);
      }
    };
    fetchData();
  }, []);

  const cards = [
    {
      title: "Customers",
      count: customerCount,
      icon: <GroupIcon className="text-gray-800 size-6" />,
      badge: <Badge color="success"><ArrowUpIcon /> +11%</Badge>,
      path: "/forms/customers",
    },
    {
      title: "Quotations",
      count: quotationCount,
      icon: <BoxIconLine className="text-gray-800 size-6" />,
      badge: <Badge color="error"><ArrowDownIcon /> -9%</Badge>,
      path: "/forms/new-quotation",
    },
    {
      title: "Deal Finalised",
      count: dealYes,
      icon: <CheckCircleIcon className="text-black size-7" />,
      path: "/forms/new-quotation",
    },
    {
      title: "Deal Not Finalised",
      count: dealNo,
      icon: <CloseIcon className="text-black size-7" />,
      path: "/forms/new-quotation",
    },
    {
      title: "Today's Followups",
      count: todaysFollowups,
      icon: <CheckCircleIcon className="text-black size-7" />, // Use existing icon
      path: "/followups",
      badge: <Badge color="info">Today</Badge>,
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
        width: "100%",
        justifyContent: "center",
        padding: 20,
      }}
    >
      {cards.map((item, index) => (
        <div
          key={index}
          className="rounded-2xl border bg-white p-5 hover:shadow-lg cursor-pointer"
          style={{
            width: "45%",
            minWidth: "300px",
            height: "140px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
          onClick={() => navigate(item.path)}
        >
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl">
            {item.icon}
          </div>

          <div className="flex justify-between items-end">
            <div>
              <span className="text-sm text-gray-500">{item.title}</span>
              <h4 className="mt-2 font-bold text-xl">{item.count}</h4>
            </div>

            {item.badge && item.badge}
          </div>
        </div>
      ))}
    </div>
  );
}
