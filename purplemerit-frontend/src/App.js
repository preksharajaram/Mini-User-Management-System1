import { useState } from "react";
import Dashboard from "./Dashboard";

function App() {
  // State for login inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // Check token
  const token = localStorage.getItem("token");

  // LOGIN FUNCTION
  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ STEP 3 — SAVE TOKEN
        localStorage.setItem("token", data.token);
        setMessage("Login successful ✅");
        window.location.reload(); // refresh to load dashboard
      } else {
        setMessage(data.message || "Login failed ❌");
      }
    } catch (error) {
      setMessage("Server error ❌");
    }
  };

  // ✅ IF TOKEN EXISTS → DASHBOARD
  if (token) {
    return <Dashboard />;
  }

  // ✅ LOGIN PAGE
  return (
    <div style={{ padding: "40px", maxWidth: "400px" }}>
      <h2>PurpleMerit Admin Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <button
        onClick={handleLogin}
        style={{ width: "100%", padding: "10px" }}
      >
        Login
      </button>

      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
