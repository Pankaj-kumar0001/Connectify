import { useEffect, useState } from "react";
import api from "../api/axios";

const Feed = () => {

  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState({});
  const [editPostId, setEditPostId] = useState(null);
  const [editText, setEditText] = useState("");

  // current user
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = currentUser?._id;

  // GET POSTS
  const getPosts = async () => {
    try {

      const res = await api.get("/posts/feed");

      setPosts(res.data.posts || []);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  // ❤️ LIKE POST
  const handleLike = async (postId) => {
    try {

      await api.put(`/posts/${postId}/like`);

      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId
            ? {
                ...post,
                likes: post.likes.includes(userId)
                  ? post.likes.filter((id) => id !== userId)
                  : [...post.likes, userId]
              }
            : post
        )
      );

    } catch (err) {
      console.log(err);
    }
  };

  // 💬 COMMENT POST
  const handleComment = async (postId) => {

    try {

      const text = commentText[postId];

      if (!text) return;

      await api.post(`/posts/${postId}/comments`, { text });

      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId
            ? {
                ...post,
                comments: [
                  ...post.comments,
                  {
                    text,
                    user: {
                      _id: userId,
                      name: currentUser.name
                    }
                  }
                ]
              }
            : post
        )
      );

      setCommentText({
        ...commentText,
        [postId]: ""
      });

    } catch (err) {
      console.log(err);
    }
  };

  // 🗑 DELETE POST
  const handleDelete = async (postId) => {

    try {

      await api.delete(`/posts/${postId}`);

      setPosts((prev) =>
        prev.filter((post) => post._id !== postId)
      );

    } catch (err) {
      console.log(err);
    }
  };

  // ✏️ UPDATE POST
  const handleUpdate = async (postId) => {

    try {

      await api.put(`/posts/${postId}`, {
        content: editText
      });

      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId
            ? { ...post, content: editText }
            : post
        )
      );

      setEditPostId(null);
      setEditText("");

    } catch (err) {
      console.log(err);
    }
  };

  return (

    <div style={styles.page}>

      {/* TOP BAR */}
      <div style={styles.topBar}>

        <h1 style={styles.logo}>Connectify</h1>

        <div style={styles.userBox}>
          👋 {currentUser?.name}
        </div>

      </div>

      {/* FEED */}
      <div style={styles.feedContainer}>

        {posts.length === 0 && (
          <p>No posts found</p>
        )}

        {posts.map((post) => (

          <div key={post._id} style={styles.card}>

            {/* USER */}
            <div style={styles.userSection}>

              <div style={styles.avatar}>
                {post.author?.name?.charAt(0)}
              </div>

              <div>
                <h3 style={styles.name}>
                  {post.author?.name}
                </h3>

                <p style={styles.username}>
                  @{post.author?.username}
                </p>
              </div>

            </div>

            {/* CONTENT */}
            {editPostId === post._id ? (
              <>
                <textarea
                  style={styles.editInput}
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />

                <button
                  style={styles.saveBtn}
                  onClick={() => handleUpdate(post._id)}
                >
                  Save
                </button>
              </>
            ) : (
              <p style={styles.content}>
                {post.content}
              </p>
            )}

            {/* IMAGE */}
            {post.image && (
              <img
                src={post.image}
                alt="post"
                style={styles.image}
              />
            )}

            {/* ACTION BUTTONS */}
            <div style={styles.actions}>

              <button
                style={styles.likeBtn}
                onClick={() => handleLike(post._id)}
              >
                ❤️ {post.likes?.length || 0}
              </button>

              {post.author?._id === userId && (
                <>
                  <button
                    style={styles.editBtn}
                    onClick={() => {
                      setEditPostId(post._id);
                      setEditText(post.content);
                    }}
                  >
                    ✏️ Edit
                  </button>

                  <button
                    style={styles.deleteBtn}
                    onClick={() => handleDelete(post._id)}
                  >
                    🗑 Delete
                  </button>
                </>
              )}

            </div>

            {/* COMMENT INPUT */}
            <div style={styles.commentBox}>

              <input
                style={styles.commentInput}
                type="text"
                placeholder="Write a comment..."
                value={commentText[post._id] || ""}
                onChange={(e) =>
                  setCommentText({
                    ...commentText,
                    [post._id]: e.target.value
                  })
                }
              />

              <button
                style={styles.commentBtn}
                onClick={() => handleComment(post._id)}
              >
                Comment
              </button>

            </div>

            {/* COMMENTS */}
            <div style={styles.commentsContainer}>

              {post.comments?.map((c, index) => (
                <div key={index} style={styles.comment}>

                  <b>{c.user?.name || "User"}:</b> {c.text}

                </div>
              ))}

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

const styles = {

  page: {
    backgroundColor: "#f4f4f4",
    minHeight: "100vh",
    paddingBottom: "40px",
  },

  topBar: {
    backgroundColor: "#111",
    color: "white",
    padding: "15px 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },

  logo: {
    margin: 0,
  },

  userBox: {
    backgroundColor: "#222",
    padding: "10px 15px",
    borderRadius: "20px",
    fontWeight: "bold",
  },

  feedContainer: {
    width: "600px",
    margin: "30px auto",
  },

  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "20px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
  },

  userSection: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "15px",
  },

  avatar: {
    width: "45px",
    height: "45px",
    borderRadius: "50%",
    backgroundColor: "#111",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    fontSize: "18px",
  },

  name: {
    margin: 0,
  },

  username: {
    margin: 0,
    color: "gray",
    fontSize: "14px",
  },

  content: {
    fontSize: "16px",
    marginBottom: "15px",
  },

  image: {
    width: "100%",
    borderRadius: "10px",
    marginBottom: "15px",
  },

  actions: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px",
  },

  likeBtn: {
    backgroundColor: "#ffe5e5",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  editBtn: {
    backgroundColor: "#e8f0ff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  deleteBtn: {
    backgroundColor: "#ffecec",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    color: "red",
  },

  commentBox: {
    display: "flex",
    gap: "10px",
  },

  commentInput: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
  },

  commentBtn: {
    backgroundColor: "#111",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  commentsContainer: {
    marginTop: "15px",
  },

  comment: {
    backgroundColor: "#f1f1f1",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "8px",
  },

  editInput: {
    width: "100%",
    minHeight: "80px",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginBottom: "10px",
  },

  saveBtn: {
    backgroundColor: "#111",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "15px",
  }

};

export default Feed;