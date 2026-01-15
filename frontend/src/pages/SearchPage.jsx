import React, { useState } from "react";
import axiosInstance from "../services/axios";
import { Search, Loader2, Info } from "lucide-react";
import toast from "react-hot-toast";

const SearchPage = () => {
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!registrationNumber.trim())
      return toast.error("Please enter a registration number");

    setLoading(true);
    try {
      const { data } = await axiosInstance.get(`/search/${registrationNumber}`);
      setStudent(data);
      toast.success("Student found!");
    } catch (error) {
      setStudent(null);
      toast.error(error.response?.data?.message || "Student not found");
    } finally {
      setLoading(false);
    }
  };

  // Hàm tính điểm trung bình tất cả các môn có điểm
  const calculateAverage = (data) => {
    const subjects = [
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
    const scores = subjects
      .map((s) => data[s])
      .filter((s) => s !== null && s !== undefined && s !== "");

    if (scores.length === 0) return 0;
    const total = scores.reduce((acc, curr) => acc + Number(curr), 0);
    return total / scores.length;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Search Section */}
      <form
        onSubmit={handleSearch}
        className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100"
      >
        <h3 className="text-lg font-bold mb-4 text-slate-800">Score Lookup</h3>
        <div className="flex gap-4">
          <input
            type="text"
            value={registrationNumber}
            onChange={(e) => setRegistrationNumber(e.target.value)}
            placeholder="Enter Registration No. (e.g., 01000001)"
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 text-slate-700 transition-all"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Search size={20} />
            )}
            Search
          </button>
        </div>
      </form>

      {student && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Section 1: Individual Subject Scores */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h4 className="text-xl font-bold mb-6 text-blue-600 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
              Results for Registration Number: {student.registration_number}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <ScoreCard label="Math" score={student.math} />
              <ScoreCard label="Literature" score={student.literature} />
              <ScoreCard
                label="Foreign Language"
                score={student.foreign_language}
              />
              <ScoreCard label="Physics" score={student.physics} />
              <ScoreCard label="Chemistry" score={student.chemistry} />
              <ScoreCard label="Biology" score={student.biology} />
              <ScoreCard label="History" score={student.history} />
              <ScoreCard label="Geography" score={student.geography} />
              <ScoreCard
                label="Civic Education"
                score={student.civic_education}
              />
            </div>
          </div>

          {/* Section 2: Detailed Scores Analysis (The "Fillable" part) */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xl font-bold text-slate-800">
                Detailed Scores Analysis
              </h4>
              <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase">
                Examination 2025
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Group Totals */}
              <div className="space-y-4">
                <h5 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                  Group Totals
                </h5>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-600">
                      Group A (A00)
                    </span>
                    <span className="font-bold text-blue-600">
                      {(
                        (Number(student.math) || 0) +
                        (Number(student.physics) || 0) +
                        (Number(student.chemistry) || 0)
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-600">
                      Group B (B00)
                    </span>
                    <span className="font-bold text-emerald-600">
                      {(
                        (Number(student.math) || 0) +
                        (Number(student.chemistry) || 0) +
                        (Number(student.biology) || 0)
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Language Code Detail */}
              <div className="space-y-4">
                <h5 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                  Language Details
                </h5>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 h-[100px] flex flex-col justify-center">
                  <p className="text-slate-500 text-sm italic flex items-center gap-2">
                    <Info size={14} />
                    Registered Code:
                    <span className="text-slate-900 font-bold not-italic">
                      {student.foreign_language_code || "N/A"}
                    </span>
                  </p>
                  <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
                    * This code identifies the specific foreign language
                    category selected by the candidate.
                  </p>
                </div>
              </div>

              {/* Overall Performance */}
              <div className="space-y-4">
                <h5 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                  Overall Summary
                </h5>
                <div className="bg-blue-600 p-4 rounded-xl text-white shadow-lg shadow-blue-200">
                  <p className="text-[10px] uppercase opacity-80 font-bold mb-1">
                    Average Score
                  </p>
                  <p className="text-3xl font-black mb-1">
                    {calculateAverage(student).toFixed(2)}
                  </p>
                  <p className="text-[10px] opacity-90 leading-tight">
                    "Detailed view of search scores here! All data is verified
                    by the examination board."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ScoreCard = ({ label, score }) => (
  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center hover:bg-white hover:shadow-md transition-all group">
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 group-hover:text-blue-500 transition-colors">
      {label}
    </p>
    <p className="text-2xl font-bold text-slate-800">{score ?? "N/A"}</p>
  </div>
);

export default SearchPage;
