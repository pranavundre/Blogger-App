import React from "react";
import { Link } from "react-router-dom";
import BlogList from "./BlogList";
import fb from "./firebase";
import useAuthState from "./hooks";
import "./css/BlogList.css";
import "./css/Home.css";

const Home = () => {
  const { user } = useAuthState(fb.auth());

  return (
    <div className="home">
      <Link to="/signin/" className="add-signin-link">
        {user ? "Profile" : "Sign in"}
      </Link>
      <BlogList />
    </div>
  );
};

export default Home;
