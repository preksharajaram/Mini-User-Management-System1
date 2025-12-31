import { useEffect, useState } from "react";

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No token found. Please login again ❌");
      return;
    }

    fetch("http://localhost:3000/api/admin/userss?page=1&limit=5", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.users) {
          setUsers(data.users);
        } else {
          setError("Failed to load users ❌");
        }
      })
      .catch(() => {
        setError("Server error ❌");
      });
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <h2>PurpleMerit Admin Dashboard</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {users.length === 0 && !error && <p>Loading users...</p>}

      {users.map((user) => (
        <div
          key={user._id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <p><b>Name:</b> {user.fullName}</p>
          <p><b>Email:</b> {user.email}</p>
          <p><b>Role:</b> {user.role}</p>
          <p><b>Status:</b> {user.status}</p>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
