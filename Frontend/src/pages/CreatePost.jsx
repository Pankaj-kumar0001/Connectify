import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {

  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleCreatePost = async (e) => {
    e.preventDefault();

    try {
      await api.post("/posts", {
        content,
        image
      });

      setContent("");
      setImage("");
      setError("");

      navigate("/feed");

    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div style={styles.container}>

      <form onSubmit={handleCreatePost} style={styles.card}>

        <h2 style={styles.title}>Create Post ✨</h2>

        <textarea
          style={styles.textarea}
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <input
          style={styles.input}
          type="text"
          placeholder="Image URL (optional)"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />

        <button style={styles.button} type="submit">
          Post 🚀
        </button>

        {error && (
          <p style={styles.error}>{error}</p>
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
    background: "linear-gradient(135deg, #ece9e6, #ffffff)"
  },

  card: {
    width: "400px",
    padding: "25px",
    borderRadius: "12px",
    backgroundColor: "#fff",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  title: {
    textAlign: "center",
    marginBottom: "10px",
    color: "#111",
  },

  textarea: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    minHeight: "100px",
    resize: "none",
    outline: "none",
    fontSize: "14px",
  },

  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
  },

  button: {
    padding: "10px",
    backgroundColor: "#111",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  error: {
    color: "red",
    textAlign: "center",
    marginTop: "5px",
  }
};

export default CreatePost;