import React, { useEffect, useState } from "react";
import axiosInstance from "../services/axios";
import { Trophy, User, Loader2 } from "lucide-react";

const RankingPage = () => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const { data } = await axiosInstance.get("/rankings-group-a");
        setRankings(data);
      } catch (err) {
        console.error("Failed to load rankings", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRankings();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
        <Trophy className="text-yellow-500" />
        <h3 className="text-xl font-bold">Top 10 Group A Rankings</h3>
      </div>
      <table className="w-full text-left">
        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
          <tr>
            <th className="px-6 py-4">Rank</th>
            <th className="px-6 py-4">Registration Number</th>
            <th className="px-6 py-4">Math</th>
            <th className="px-6 py-4">Physics</th>
            <th className="px-6 py-4">Chemistry</th>
            <th className="px-6 py-4 text-right">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rankings.map((student, index) => (
            <tr
              key={student.registration_number}
              className="hover:bg-slate-50 transition-colors"
            >
              <td className="px-6 py-4 font-bold text-blue-600">
                #{index + 1}
              </td>
              <td className="px-6 py-4 font-semibold">
                {student.registration_number}
              </td>
              <td className="px-6 py-4">{student.math}</td>
              <td className="px-6 py-4">{student.physics}</td>
              <td className="px-6 py-4">{student.chemistry}</td>
              <td className="px-6 py-4 text-right font-bold text-green-600">
                {student.total_group_a}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RankingPage;
