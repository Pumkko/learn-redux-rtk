import "./App.css";
import AddPost from "./features/addPost";
import { useQuery } from "react-query";
import { Post as PostModel } from "./features/models/Post";
import Post from "./features/posts";
import { createWebStoragePersistor } from "react-query/createWebStoragePersistor-experimental";
import { persistQueryClient } from "react-query/persistQueryClient-experimental";
import { useEffect } from "react";
import queryClient from "./app/queryClient";

function App() {
  const persisClient = () => {
    persistQueryClient({
      queryClient: queryClient,
      persistor: createWebStoragePersistor({
        storage: window.localStorage,
        throttleTime: 100,
      }),
      maxAge: Infinity,
    });
  };

  useEffect(() => {
    queryClient.resumePausedMutations();
    persisClient();

    return () => {
      persisClient();
    };
  }, []);

  const { data } = useQuery<Array<PostModel>>("posts");
  if (data) {
    return (
      <div className="App">
        <AddPost></AddPost>
        {data
          .sort(
            (a, b) => Date.parse(b.creationDate) - Date.parse(a.creationDate)
          )
          .map((p) => (
            <Post key={p.id} post={p}></Post>
          ))}
      </div>
    );
  } else {
    return <div>I'm either dead or working</div>;
  }
}

export default App;
