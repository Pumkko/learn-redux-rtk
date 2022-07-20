import "./App.css";
import AddPost from "./features/addPost";
import { Post as PostModel } from "./features/models/Post";
import PostItem from "./features/postItem";
import { useEffect, useState } from "react";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { onlineManager, useQuery } from "@tanstack/react-query";
import { Accordion, Button } from "react-bootstrap";
import { PostList } from "./features/postList";

function App() {
  const { refetch } = useQuery(["general"], {
    enabled: false,
  });
  const { data: posts } = useQuery<PostModel[]>(["posts"], {
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
        <PostList posts={posts ?? []}/>
      </div>
    );
  } else {
    return (
      <div className="d-flex justify-content-center align-items-center h-100">
        <Button
          className="mx-2"
          variant="primary"
          onClick={() => {
            refetch();
          }}
        >
          Prefetch
        </Button>
        <Button
          className="mx-2"
          variant="primary"
          onClick={() => {
            setShowPost(true);
          }}
        >
          Show data
        </Button>
      </div>
    );
  }
}

export default App;
