import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_ENDPOINT_URL;

  const handleLogout = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");

    try {
      await fetch(`${baseUrl}/api/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // Always clear tokens and redirect, even if request fails
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      navigate("/login");
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleLogout}
      disabled={isLoading}
      className="ml-auto"
    >
      {isLoading ? "Logging out..." : "Logout"}
    </Button>
  );
}
