import React, { useEffect, useState } from "react";
import axiosInstance from "../services/axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Loader2, AlertCircle } from "lucide-react";

const StatisticsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const CustomLegend = () => {
    const items = [
      { name: "Excellent (≥8)", color: "#10b981" },
      { name: "Good (6-8)", color: "#3b82f6" },
      { name: "Average (4-6)", color: "#f59e0b" },
      { name: "Below Average (<4)", color: "#ef4444" },
    ];

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "24px",
          paddingBottom: "20px",
        }}
      >
        {items.map((item) => (
          <div
            key={item.name}
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <div
              style={{
                width: "14px",
                height: "14px",
                backgroundColor: item.color,
                borderRadius: "2px",
              }}
            />
            <span style={{ fontSize: "14px", color: "#64748b" }}>
              {item.name}
            </span>
          </div>
        ))}
      </div>
    );
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get("/statistics");
        const rawData = response.data;

        const subjectOrder = [
          "math",
          "literature",
          "foreign_language",
          "physics",
          "chemistry",
          "biology",
          "history",
          "geography",
          "civic_education",
        ];

        const formattedData = subjectOrder
          .filter((key) => rawData[key])
          .map((key) => ({
            subject: key
              .replace("_", " ")
              .replace(/\b\w/g, (l) => l.toUpperCase()),
            excellent: parseInt(rawData[key].excellent || 0),
            good: parseInt(rawData[key].good || 0),
            average: parseInt(
              rawData[key].average || rawData[key].avarage || 0
            ),
            below_average: parseInt(rawData[key].below_average || 0),
          }));

        setData(formattedData);
      } catch (err) {
        console.error("Failed to load statistics", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-slate-500 font-medium">Analyzing exam data...</p>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-[600px]">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="90%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="subject"
                angle={-45}
                textAnchor="end"
                interval={0}
                height={80}
              />
              <YAxis />
              <Tooltip />

              <Legend
                verticalAlign="top"
                align="center"
                wrapperStyle={{ paddingBottom: "30px" }}
                content={<CustomLegend />}
              />

              <Bar
                dataKey="excellent"
                fill="#10b981"
                name="Excellent (≥8)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="good"
                fill="#3b82f6"
                name="Good (6-8)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="average"
                fill="#f59e0b"
                name="Average (4-6)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="below_average"
                fill="#ef4444"
                name="Below Average (<4)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <AlertCircle size={48} className="mb-2 opacity-20" />
            <p>No data available to display chart.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatisticsPage;
