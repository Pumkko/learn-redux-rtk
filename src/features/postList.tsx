import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Accordion, Button } from "react-bootstrap";
import AddPost from "./addPost";
import { Post } from "./models/Post";
import PostItem from "./postItem";

export interface PostListProps {
  posts: Post[];
}

export const PostList = ({ posts }: PostListProps) => {
  const [showAddNewPost, setShowAddNewPost] = useState(false);

  const fakeUpdate = useMutation<unknown, unknown, Post>(['updatePost']);

  return (
    <>
      <Accordion defaultActiveKey="0" flush>
        {posts
          .sort(
            (a, b) => Date.parse(b.creationDate) - Date.parse(a.creationDate)
          )
          .map((p) => (
            <PostItem key={p.id} post={p}></PostItem>
          ))}
      </Accordion>
      <Button
        className="mt-3"
        variant="primary"
        onClick={() => setShowAddNewPost(true)}
      >
        Add Post
      </Button>
      <Button onClick={() => {
        const firstPost = posts[0];
        firstPost.content = "updated";
        fakeUpdate.mutate(firstPost)
      }}>
        Fake update
      </Button>
      {showAddNewPost && (
        <AddPost onClose={() => setShowAddNewPost(false)}></AddPost>
      )}
    </>
  );
};
