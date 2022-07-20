import React from "react";
import * as ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorkerRegistration";
import queryClient, { persister } from "./app/queryClient";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";

import 'bootstrap/dist/css/bootstrap.min.css';

const container = document.getElementById("root") as HTMLElement;
const root = ReactDOM.createRoot(container);


root.render(
  <PersistQueryClientProvider
    client={queryClient}
    persistOptions={{ persister }}
    onSuccess={() => {
      // resume mutations after initial restore from localStorage was successful
      queryClient.resumePausedMutations();
    }}
  >
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </PersistQueryClientProvider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
