import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import fb from "./firebase.js";
import { Editor } from '@tinymce/tinymce-react';

const DB = fb.firestore();
const Bloglist = DB.collection("blogs");

const BlogEdit = () => {
  const { id } = useParams();

  const [title, SetTitle] = useState("");
  const [body, SetBody] = useState("");
  const [cover, SetCover] = useState("");

  useEffect(() => {
    Bloglist.doc(id)
      .get()
      .then((snapshot) => {
        const data = snapshot.data();
        SetTitle(data.title);
        SetBody(data.body);
        SetCover(data.coverimg);
      });
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
  
    // Upload the new cover image to storage if it's changed
    const storageRef = fb.storage().ref();
    const imageRef = storageRef.child(`images/${cover.name}`);
    await imageRef.put(cover);
    const imageUrl = await imageRef.getDownloadURL();

    // Update Firestore document with new cover image URL
    Bloglist.doc(id)
      .update({
        title: title,
        body: body,
        coverimg: imageUrl,
      })
      .then((docRef) => {
        alert("Blog successfully updated");
      })
      .catch((error) => {
        console.error("Error editing the blog: ", error);
      });
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Edit Blog</h1>
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
          onChange={(e) => {
            SetCover(e.target.files[0]);
          }}
        />

        <Editor
          textareaName="content" 
          initialValue={body}
          onEditorChange={(newText) => { SetBody(newText)}}
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

export default BlogEdit;
