import { Accordion } from "react-bootstrap";
import { Post as PostModel } from "./models/Post";
import "./posts.css";

interface PostProps {
  post: PostModel;
}

const Post: React.FC<PostProps> = ({ post }: PostProps) => {
  return (
    <Accordion.Item eventKey="0">
      <Accordion.Header>{post.title}</Accordion.Header>
      <Accordion.Body>{post.content}</Accordion.Body>
    </Accordion.Item>
  );
};

export default Post;
