import App from "@/App";
import ProjectDetails from "@/pages/[projectName]/page";
import LoginForm from "@/pages/login/page";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/:uuid" element={<ProjectDetails />} />
        <Route path="/login" element={<LoginForm />} />
      </Routes>
    </Router>
  );
}
