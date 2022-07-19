import "./App.css";
import AddPost from "./features/addPost";
import { Post as PostModel } from "./features/models/Post";
import Post from "./features/posts";
import { useEffect, useState } from "react";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { useQuery } from "@tanstack/react-query";

function App() {
  const { refetch } = useQuery(["general"], {
    enabled: false,
  });
  const { data } = useQuery<PostModel[]>(["posts"], {
    enabled: false,
  });

  const [showPost, setShowPost] = useState(false);

  const [connection, setConnection] = useState<HubConnection | null>(null);

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("https://pwa-react-violinews.azurewebsites.net/postHub", {
        withCredentials: false,
      })
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log("Connected!");

          connection.on("ReceiveMessage", () => {
            alert("New post");
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
