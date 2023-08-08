import React, { useState } from "react";
import fb from "./firebase.js";
import { Editor } from "@tinymce/tinymce-react";
import useAuthState from "./hooks.js";

const DB = fb.firestore();
const Bloglist = DB.collection("blogs");
const storageRef = fb.storage().ref();

const CreateBlog = () => {
  const { user, initializing } = useAuthState(fb.auth());
  const [title, SetTitle] = useState("");
  const [body, SetBody] = useState("");
  const [cover, SetCover] = useState("");
  // const likes = blog.likes || []; 
  // const [likecount, SetLikecount] = useState(0);

  const handleCoverImgChange = (e) => {
    if (e.target.files[0]) {
      SetCover(e.target.files[0]);
    }
  };

  
  const submit = async (e) => {
    e.preventDefault();

    const uploadTask = storageRef.child(`images/${cover.name}`).put(cover);
    await uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.log(error);
      },
      async () => {
        const url = await storageRef.child("images/" + cover.name).getDownloadURL();
        console.log("img url : ", url);
        Bloglist.add({
          title: title,
          body: body,
          coverimg: url,
          author: user.displayName,
          // likecount: likecount,
        }).then(() => {
          alert("Blog successfully added");
        }).catch((error) => {
          console.error("Error adding blog: ", error);
        });
      }
    );
  };

  if (initializing) return "Loading...";

  return (
    <div className="form-container">
      <h1 className="form-title">Add New Blog</h1>
      <form onSubmit={(event) => submit(event) ? window.history.back() : void 0}>
        <input
          className="form-input"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => {
            SetTitle(e.target.value);
          }}
          required
        />

        <input
          className="form-input"
          type="file"
          name="coverimg"
          accept="image/*"
          onChange={(e) => {
            handleCoverImgChange(e);
          }}
        />

        <Editor
          textareaName="content"
          initialValue=""
          onEditorChange={(newText) => {
            SetBody(newText);
          }}
          reqeuired
        />

        <button className="form-submit" onClick={() => window.history.back()}>
          Back
        </button>

        <button type="submit" className="form-submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateBlog;
