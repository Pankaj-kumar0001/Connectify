import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Feed from "./pages/Feed";
import CreatePost from "./pages/CreatePost";
import Navbar from "./pages/Navbar";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  return (

    <Routes>

      {/* LOGIN */}
      <Route path="/" element={<Login />} />

      {/* REGISTER */}
      <Route path="/register" element={<Register />} />

      {/* FEED */}
      <Route
        path="/feed"
        element={
          <ProtectedRoute>
            <>
              <Navbar />
              <Feed />
            </>
          </ProtectedRoute>
        }
      />

      {/* CREATE POST */}
      <Route
        path="/create-post"
        element={
          <ProtectedRoute>
            <>
              <Navbar />
              <CreatePost />
            </>
          </ProtectedRoute>
        }
      />

    </Routes>

  );
}

export default App;