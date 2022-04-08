import { useEffect, useState } from "react";
import { useCreatePostMutation } from "./postApi";
import "./posts.css";

const AddPost: React.FC = () => {
  const [addPost] = useCreatePostMutation();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const clearState = () => {
    setTitle("");
    setContent("");
  };

  return (
    <div className="post-container">
      <div className="post-title">
        <input
          onChange={(e) => setTitle(e.currentTarget.value)}
          value={title}
          type={"text"}
        />
        <span>{new Date().toDateString()}</span>
      </div>
      <textarea
        onChange={(e) => setContent(e.currentTarget.value)}
        value={content}
        className="content-text-area"
      ></textarea>
      <button
        onClick={async () => {
          await addPost({
            content,
            title,
          }).unwrap();
          clearState();
        }}
      >
        Add
      </button>
    </div>
  );
};

export default AddPost;
