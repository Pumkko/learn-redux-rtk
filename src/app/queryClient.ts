import axios from "axios";
import { QueryClient } from "react-query";

import { CreatePostCommand } from "../features/models/CreatePostCommand";
import { Post } from "../features/models/Post";
import { v4 as uuid } from "uuid";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: Infinity,
    },
  },
});

queryClient.setQueryDefaults(["general"], {
  queryFn: async () => {
    const { data } = await axios.get(`https://localhost:7185/Post`);
    return data;
  },
  onSuccess(data) {
    const post = data as Post[];
    const d = queryClient.setQueryData(['posts'], post);
    console.log(d);
  },
});

queryClient.setMutationDefaults("post", {
  mutationFn: (post) =>
    axios.post(`https://localhost:7185/Post`, {
      id: uuid(),
      creationDate: new Date().toLocaleDateString(),
      ...post,
    }),
  onMutate: async (post: CreatePostCommand) => {
    // Cancel current queries for the todos list
    await queryClient.cancelQueries("posts");

    // Create optimistic todo
    const optimisticPost: Post = {
      id: uuid(),
      creationDate: new Date().toLocaleDateString(),
      ...post,
    };

    // Add optimistic todo to todos list
    queryClient.setQueryData<Array<Post>>("posts", (old) => {
      if (old) {
        return [...old, optimisticPost];
      } else {
        return [optimisticPost];
      }
    });

    // Return context with the optimistic todo
    return { optimisticPost };
  },
  onError: (error, variables, context) => {
    if (error.code === "ERR_NETWORK") {
      return;
    }
    // Remove optimistic todo from the todos list
    queryClient.setQueryData<Array<Post>>(
      "posts",
      (old) =>
        old?.filter((todo) => todo.id !== context?.optimisticPost.id) ?? []
    );
  },
  retry: 1,
});

export default queryClient;
