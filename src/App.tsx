import "./App.css";
import { Post as PostModel } from "./features/models/Post";
import { useEffect, useState } from "react";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PostList } from "./features/postList";
import { Alert, Button } from "react-bootstrap";

function App() {
  const { data: posts } = useQuery<PostModel[]>(["posts"], {
    enabled: false,
  });

  const { refetch } = useQuery(["general"], {
    enabled: false,
  });

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

  const { isSuccess } = useQuery(["healthCheck"]);

  const queryClient = useQueryClient();

  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    setIsOnline(isSuccess);
  }, [isSuccess, queryClient]);

  return (
    <>
      <div className="App">
        {isOnline ? (
          <Alert variant="success">Online</Alert>
        ) : (
          <Alert variant="danger">Offline</Alert>
        )}
        <PostList posts={posts ?? []} />
        <Button
          className="m-2"
          variant="warning"
          onClick={() => {
            refetch();
          }}
        >
          Refetch
        </Button>
      </div>
    </>
  );
}

export default App;
