import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import fb from "./firebase.js";
const DB = fb.firestore();
const Bloglist = DB.collection("blogs");

const BlogList = () => {
  const [blogs, SetBlogs] = useState([]);
  const [search, SetSearch] = useState("");

  const DeleteBlog = (id) => {
    const shouldDelete = window.confirm("Are you sure you want to delete this blog?");
    if (shouldDelete) {
      Bloglist.doc(id)
        .delete()
        .then(() => {
          alert("Blog successfully deleted");
        })
        .catch((error) => {
          console.error("Error deleting blog: ", error);
        });
    }};

    const SearchBlog = (e) => {
      e.preventDefault();
      SetBlogs(blogs.filter((blog) => blog.title.toLowerCase().includes(search.toLowerCase())));
      SetBlogs(blogs.filter((blog) => blog.body.toLowerCase().includes(search.toLowerCase())));
    }

  useEffect(() => {
    const unsubscribe = Bloglist.limit(100).onSnapshot((querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      SetBlogs(data);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="container">
      <div className="header">
        <Link to="/add" className="add-blog-link">
          Add Blog
        </Link>

        <form onSubmit={(e) => {SearchBlog(e)}}>
          <input className="search-field" onChange = {(e) => {SetSearch(e.target.value)}} />
          <button className="search-btn" type="submit">Search</button>
        </form>
      </div>

      <h1 className="page-title">Blog List</h1>
      {blogs.map((blog) => (
        <div key={blog.id} className="blog-card">

          <h2 className="blog-title">{blog.title}</h2>
          <div  dangerouslySetInnerHTML={{__html: blog.body}} className="blog-body" />
          {blog.coverimg ? <img className="blog-img" src={blog.coverimg} alt="" /> : null}

          <div className="blog-links">

            <Link to={"/show/" + blog.id} className="read-link">
              Read
            </Link>

            <Link to={"/edit/" + blog.id} className="edit-link">
              Edit
            </Link>

            <button className="del-btn" onClick={() => {DeleteBlog(blog.id)}}>Delete</button>

          </div>
        </div>
      ))}
    </div>
  );
};

export default BlogList;
