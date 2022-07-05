import axios from "axios";
import { QueryClient } from "react-query";

import { CreatePostCommand } from "../features/models/CreatePostCommand";
import { Post } from "../features/models/Post";

export const queryClient = new QueryClient();

queryClient.setQueryDefaults("posts", {
  queryFn: async () => {
    const { data } = await axios.get(`https://localhost:7185/Post`);
    return data;
  },
});