import "./App.css";
import AddPost from "./features/addPost";
import { useQuery } from "react-query";
import { Post as PostModel } from "./features/models/Post";
import Post from "./features/posts";
import { createWebStoragePersistor } from "react-query/createWebStoragePersistor-experimental";
import { persistQueryClient } from "react-query/persistQueryClient-experimental";
import { useEffect, useState } from "react";
import queryClient from "./app/queryClient";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";

persistQueryClient({
  queryClient: queryClient,
  persistor: createWebStoragePersistor({
    storage: window.localStorage,
    throttleTime: 100,
  }),
  maxAge: Infinity,
});

function App() {
  const { refetch } = useQuery("general", {
    enabled: false,
  });
  const { data } = useQuery<PostModel[]>("posts", {
    enabled: false,
  });

  const [showPost, setShowPost] = useState(false);

  const [connection, setConnection] = useState<HubConnection | null>(null);

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("https://localhost:7185/postHub", { withCredentials: false })
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then((result) => {
          console.log("Connected!");

          connection.on("ReceiveMessage", (message) => {
            alert('New post')
          });
        })
        .catch((e) => console.log("Connection failed: ", e));
    }
  }, [connection]);

  if (showPost) {
    return (
      <div className="App">
        <AddPost></AddPost>
        {data &&
          data
            .sort(
              (a, b) => Date.parse(b.creationDate) - Date.parse(a.creationDate)
            )
            .map((p) => <Post key={p.id} post={p}></Post>)}
      </div>
    );
  } else {
    return (
      <div>
        <button
          onClick={() => {
            refetch();
          }}
        >
          Prefetch
        </button>
        <button
          onClick={() => {
            setShowPost(true);
          }}
        >
          Show data
        </button>
      </div>
    );
  }
}

export default App;
