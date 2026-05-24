import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div style={styles.navbar}>

      <h2 style={styles.logo}>Connectify</h2>

      <div style={styles.links}>

        {/* IF USER NOT LOGGED IN */}
        {!user && (
          <>
            <Link style={styles.link} to="/register">Register</Link>
            <Link style={styles.link} to="/login">Login</Link>
          </>
        )}

        {/* IF USER LOGGED IN */}
        {user && (
          <>
            <Link style={styles.link} to="/feed">Feed</Link>
            <Link style={styles.link} to="/create-post">Create Post</Link>

            <button style={styles.logout} onClick={handleLogout}>
              Logout
            </button>
          </>
        )}

      </div>

    </div>
  );
};

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    backgroundColor: "#111",
    color: "white",
  },

  logo: {
    margin: 0,
    fontSize: "20px",
  },

  links: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
  },

  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "16px",
  },

  logout: {
    padding: "6px 12px",
    cursor: "pointer",
    backgroundColor: "red",
    color: "white",
    border: "none",
    borderRadius: "5px",
  }
};

export default Navbar;