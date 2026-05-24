import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/users/login", formData);

      localStorage.setItem("token", response.data.Accesstoken);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      setError("");

      navigate("/feed"); // ✅ proper React redirect

    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={styles.container}>

      <form onSubmit={handleSubmit} style={styles.form}>

        <h2 style={styles.title}>Login</h2>

        <input
          style={styles.input}
          type="email"
          name="email"
          placeholder="Enter your email"
          onChange={onChange}
        />

        <input
          style={styles.input}
          type="password"
          name="password"
          placeholder="Enter your password"
          onChange={onChange}
        />

        <button style={styles.button} type="submit">
          Login
        </button>

        {/* ERROR MESSAGE */}
        {error && (
          <div style={styles.errorBox}>
            <p style={{ margin: 0 }}>{error}</p>
            <p style={{ marginTop: "8px" }}>
              New user?{" "}
              <Link to="/register" style={styles.link}>
                Register now
              </Link>
            </p>
          </div>
        )}

      </form>

    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f6f8",
  },

  form: {
    width: "350px",
    padding: "25px",
    borderRadius: "10px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  title: {
    textAlign: "center",
    marginBottom: "10px",
  },

  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    outline: "none",
  },

  button: {
    padding: "10px",
    backgroundColor: "#111",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },

  errorBox: {
    marginTop: "10px",
    padding: "10px",
    backgroundColor: "#ffe6e6",
    color: "red",
    borderRadius: "5px",
    textAlign: "center",
  },

  link: {
    color: "blue",
    textDecoration: "none",
    fontWeight: "bold",
  },
};

export default Login;