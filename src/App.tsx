import { BrowserRouter as Router, Routes, Route } from "react-router";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import HomePage from "./pages/Home/HomePage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import SignInterpreterPage from "./pages/SignInterpreter/SignInterpreterPage";
import CaptionerPage from "./pages/Captioner/CaptionerPage";
import DermaScanPage from "./pages/DermaScan/DermaScanPage";
import HistoryPage from "./pages/History/HistoryPage";
import SettingsPage from "./pages/Settings/SettingsPage";
import HelpPage from "./pages/Help/HelpPage";
import NotFound from "./pages/OtherPage/NotFound";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import ProfileSetup from "./pages/AuthPages/ProfileSetup";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* ── Public marketing page ── */}
        <Route path="/" element={<HomePage />} />

        {/* ── Auth (standalone, no sidebar) ── */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />

        {/* ── App shell with sidebar ── */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard"        element={<DashboardPage />} />
          <Route path="/sign-interpreter" element={<SignInterpreterPage />} />
          <Route path="/captioner"        element={<CaptionerPage />} />
          <Route path="/derma-scan"       element={<DermaScanPage />} />
          <Route path="/history"          element={<HistoryPage />} />
          <Route path="/settings"         element={<SettingsPage />} />
          <Route path="/help"             element={<HelpPage />} />
        </Route>

        {/* ── 404 ── */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
