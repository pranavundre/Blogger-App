import React, { useState } from "react";
import { useParams } from "react-router-dom";
import fb from "./firebase.js";
import useAuthState from "./hooks.js";
import { v4 as uuidv4 } from "uuid";
// import Avatar from "@mui/material/Avatar";
// import SendIcon from "@mui/icons-material/Send";
// import DeleteIcon from "@mui/icons-material/Delete";
// import IconButton from "@mui/material/IconButton";

const DB = fb.firestore();
const Bloglist = DB.collection("blogs");

function LikeBlogButton({ id, likes }) {
  const BlogRef = DB.collection("blogs").doc(id);
  const { user } = useAuthState(fb.auth());

  const handleLikes = () => {
    if (BlogRef) {
      if (likes?.includes(user.uid)) {
        BlogRef.update({
          likes: fb.firestore.FieldValue.arrayRemove(user.uid),
        });
      } else {
        BlogRef.update({
          likes: fb.firestore.FieldValue.arrayUnion(user.uid),
        });
      }
    }
  };

  return (
    <button className="like-btn" onClick={() => handleLikes()}>
      {likes?.includes(user.uid) ? "Unlike" : "Like"}
    </button>
  );
}

const ReadBlog = () => {
  const { id } = useParams();
  const [blog, SetBlog] = useState({});
  const { user, initializing } = useAuthState(fb.auth());
  const [comment, SetComment] = useState("");
  const [commentsList, SetCommentsList] = useState([]);

  Bloglist.doc(id)
    .get()
    .then((snapshot) => {
      const data = snapshot.data();
      const commentData = data.comments || [];
      SetBlog({ ...data, id: id });
      SetCommentsList(commentData);
    });

  const handleComment = (e) => {
    if (e.key === "Enter") {
      Bloglist.doc(id)
        .update({
          comments: fb.firestore.FieldValue.arrayUnion({
            userID: user.uid,
            userName: user.displayName,
            userImg: user.photoURL,
            comment: comment,
            timestamp: fb.firestore.Timestamp.now(),
            commentID: uuidv4(),
          }),
        })
        .then(() => {
          SetComment("");
        });
    }
  };

  const handleCommentDelete = (item) => {
    Bloglist.doc(id).update({
      comments: fb.firestore.FieldValue.arrayRemove(item),
    });
  };

  if (Object.keys(blog).length === 0 || initializing) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <div className="blog-details">
        <h1 className="blog-title">{blog.title}</h1>
        <div
          dangerouslySetInnerHTML={{ __html: blog.body }}
          className="blog-body"
        />
        <div className="actions">
          {user ? <LikeBlogButton id={blog.id} likes={blog.likes} /> : null}

          <span className="likes-count">
            {blog.likes ? blog.likes.length : 0} Likes
          </span>

          <button className="back-btn" onClick={() => window.history.back()}>
            Back
          </button>
        </div>

        <div className="comments">
          {user ? (
            <div className="add-comment">
              <input
                className="comment-input"
                type="text"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => SetComment(e.target.value)}
                onKeyDown={(e) => handleComment(e)}
              />
            </div>
          ) : null}

          <div className="comments-list">
            {commentsList !== undefined &&
              commentsList.map((item) => (
                <div key={item.commentID} className="comment">
                  <div className="user-info">
                    <img src={item.userImg} alt="" className="user-img" />
                    <p className="comment-user">{item.userName}</p>
                  </div>
                  <div className="comment-content">
                    <p className="comment-text">{item.comment}</p>
                    {user &&
                    (user.uid === blog.author || user.uid === item.userID) ? (
                      <button
                        className="delete-comment-btn"
                        onClick={() => handleCommentDelete(item)}
                      >
                        Delete
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadBlog;
