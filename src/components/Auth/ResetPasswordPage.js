import React, { useState } from "react";
import API from "../../services/api";
import { useNavigate, useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const query = useQuery();
  const token = query.get("token");

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg("");
    try {
      await API.post("/auth/reset-password", { token, newPassword: password });
      setMsg("Password reset! You can now log in.");
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMsg(err?.response?.data || "Failed to reset password.");
    }
  };

  if (!token) {
    return (
      <div className="container mt-5" style={{ maxWidth: 400 }}>
        <div className="alert alert-danger">Invalid or missing reset token.</div>
      </div>
    );
  }

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h3>Reset Password</h3>
      <form onSubmit={handleSubmit}>
        <input
          name="password"
          type="password"
          className="form-control mb-2"
          placeholder="Enter new password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          minLength={6}
        />
        <button className="btn btn-primary w-100" type="submit" disabled={success}>Reset Password</button>
      </form>
      {msg && <div className={`alert mt-3 ${success ? 'alert-success' : 'alert-info'}`}>{msg}</div>}
    </div>
  );
}
