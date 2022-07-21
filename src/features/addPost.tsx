import { onlineManager, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { CreatePostCommand } from "./models/CreatePostCommand";
import { Post } from "./models/Post";
import "./posts.css";
import { v4 as uuid } from "uuid";

export interface AddPostProps {
  onClose: () => void;
}

const AddPost = ({ onClose }: AddPostProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<any, any, CreatePostCommand>(["createPosts"], {
    onMutate: async (post: CreatePostCommand) => {
      // Cancel current queries for the todos list
      await queryClient.cancelQueries(["posts"]);

      // Create optimistic todo
      const optimisticPost: Post = {
        id: uuid(),
        creationDate: new Date().toLocaleDateString(),
        ...post,
      };

      // Add optimistic todo to todos list
      queryClient.setQueryData<Array<Post>>(["posts"], (old) => {
        if (old) {
          return [...old, optimisticPost];
        } else {
          return [optimisticPost];
        }
      });

      // Return context with the optimistic todo
      return { optimisticPost };
    }
  });

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  return (
    <Modal show={true} centered={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add new post</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Title</Form.Label>
            <Form.Control
              placeholder="Enter title"
              onChange={(c) => setTitle(c.currentTarget.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Content</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Content"
              onChange={(c) => setContent(c.currentTarget.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={onClose} className="mx-1" variant="secondary">
          Close
        </Button>
        <Button
          className="mx-1"
          variant="primary"
          onClick={() => {
            mutation.mutate({
              content,
              title,
            });
            onClose();
          }}
        >
          Save changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddPost;
