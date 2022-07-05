import React from "react";
import "./App.css";
import AddPost from "./features/addPost";
import { useQuery } from "react-query";
import { Post as PostModel } from "./features/models/Post";
import Post from "./features/posts";


function App() {

  const { data } = useQuery<Array<PostModel>>('posts');

  if (data) {
    return (
      <div className="App">
        <AddPost></AddPost>
        {data.map((p) => (
          <Post key={p.id} post={p}></Post>
        ))}
      </div>
    );
  }
  else {
    return <div>I'm either dead or working</div>
  }

}

export default App;
