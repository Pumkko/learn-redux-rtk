import React from "react";
import "./App.css";
import Post from "./features/posts";
import AddPost from "./features/addPost";
import { useGetAllPostsQuery } from "./features/postApi";

function App() {
  const { data, isLoading } = useGetAllPostsQuery(undefined);

  if(isLoading){
    return (<div>Loading...</div>)
  }
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

  return <div>Sorry something happened</div>
}

export default App;
