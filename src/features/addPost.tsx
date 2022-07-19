import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { CreatePostCommand } from "./models/CreatePostCommand";
import "./posts.css";

const AddPost: React.FC = () => {
  const mutation = useMutation<any, any, CreatePostCommand>(['createPosts']);

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
          const addCommand: CreatePostCommand = {
            content,
            title,
          };
          mutation.mutate(addCommand);
          clearState();
        }}
      >
        Add
      </button>
    </div>
  );
};

export default AddPost;
