import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Import Components & Pages
import Navbar from "./components/Navbar.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import StatisticsPage from "./pages/StatisticsPage.jsx";
import RankingPage from "./pages/RankingPage.jsx";
// Giả sử bạn sẽ tạo các file này sau:

function App() {
  return (
    <div className="flex min-h-screen bg-slate-50 font-rubik">
      {/* Navbar cố định bên trái */}
      <Navbar />

      {/* Nội dung chính bên phải */}
      <main className="flex-1 ml-64 p-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">
            High school exam scoring system
          </h1>
          <p className="text-slate-500">Official data from 2025</p>
        </header>

        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
          <Route path="/top-10" element={<RankingPage />} />

          {/* Redirect nếu sai đường dẫn */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <Toaster position="top-right" />
    </div>
  );
}

export default App;
