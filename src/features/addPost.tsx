import axios from "axios";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { CreatePostCommand } from "./models/CreatePostCommand";
import "./posts.css";
import { v4 as uuid } from "uuid";
import { Post } from "./models/Post";

const AddPost: React.FC = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (post) => axios.post(`https://localhost:7185/Post`, post),
    {
      onMutate: async (post: CreatePostCommand) => {
        // Cancel current queries for the todos list
        await queryClient.cancelQueries("posts");

        // Create optimistic todo
        const optimisticPost: Post = {
          id: uuid(),
          creationDate: new Date().toLocaleDateString(),
          ...post,
        };

        // Add optimistic todo to todos list
        queryClient.setQueryData<Array<Post>>("posts", (old) => {
          if (old) {
            return [...old, optimisticPost];
          } else {
            return [optimisticPost];
          }
        });

        // Return context with the optimistic todo
        return { optimisticPost };
      },
      onError: (error, variables, context) => {
        // Remove optimistic todo from the todos list
        queryClient.setQueryData<Array<Post>>(
          "posts",
          (old) =>
            old?.filter((todo) => todo.id !== context?.optimisticPost.id) ?? []
        );
      },
      retry: 3,
    }
  );

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
