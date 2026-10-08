
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const started = useRef(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    logout()
      .then(() => {
        navigate("/login", { replace: true });
      })
      .catch((err) => {
        setError(err.message || "Logout failed.");
      });
  }, [logout, navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#050507] text-white">
      <p>Signing out...</p>
      {error && <p className="text-red-400">{error}</p>}
    </div>
  );
};

export default Logout;
