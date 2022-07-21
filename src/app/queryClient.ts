import axios from "axios";

import { CreatePostCommand } from "../features/models/CreatePostCommand";
import { Post } from "../features/models/Post";
import { v4 as uuid } from "uuid";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { onlineManager, QueryClient } from "@tanstack/react-query";

export const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: Infinity,
    },
    mutations: {
      cacheTime: Infinity,
    },
  },
});

queryClient.setQueryDefaults(["healthCheck"], {
  networkMode: "always",
  queryFn: async () => {
    const response = await axios.get(
      `https://pwa-react-violinews.azurewebsites.net/health`
    );
    return response.data;
  },
  refetchInterval: 5000,
  onSuccess: () => {
    onlineManager.setOnline(true);
    queryClient.resumePausedMutations();
  },
  onError: (error) => {
    console.log(error);
    onlineManager.setOnline(false);
  },
});

queryClient.setQueryDefaults(["general"], {
  queryFn: async () => {
    const { data } = await axios.get(
      `https://pwa-react-violinews.azurewebsites.net/Post`
    );
    return data;
  },
  onSuccess: (data) => {
    const post = data as Post[];
    const d = queryClient.setQueryData(["posts"], post);
    console.log(d);
  },
});

queryClient.setMutationDefaults(['updatePost'], {
  mutationFn: (post) => {
    console.log('updated ' + post);
    return post;
  },
  onMutate: (updatedPost: Post) => {
    queryClient.setQueryData<Post>(["posts", "any gibberrish here ?"], updatedPost);
  }
})

queryClient.setMutationDefaults(["createPosts"], {
  mutationFn: (post) =>
    axios.post(`https://pwa-react-violinews.azurewebsites.net/Post`, {
      id: uuid(),
      creationDate: new Date().toLocaleDateString(),
      ...post,
    }),
    onError: (error, variables, context) => {
      queryClient.setQueryData<Array<Post>>(
        ["posts"],
        (old) =>
          old?.filter((todo) => todo.id !== context?.optimisticPost.id) ?? []
      );
    },
    retry: (failureCount, error) => {
      if (error.code === "ERR_NETWORK") {
        onlineManager.setOnline(false);
        return true;
      }

      return false;
    },
});

export default queryClient;
