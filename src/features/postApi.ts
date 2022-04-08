import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { CreatePostCommand } from './models/CreatePostCommand'
import { Post } from './models/Post'

export const PostApi = createApi({
    reducerPath: 'PostApi',
    baseQuery: fetchBaseQuery({ baseUrl:'https://localhost:7185/'}),
    tagTypes: ['Posts'],
    endpoints: (builder) => ({
        getAllPosts: builder.query<Post[], undefined>({
            query: () => '/Post',
            providesTags: ['Posts']
        }),
        deletePost: builder.mutation<undefined, string>({
            query: (postId) => ({
                url: `/Post/${postId}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Posts']
        }),
        createPost: builder.mutation<string, CreatePostCommand>({
            query: (post) => ({
                url: '/Post',
                method: 'POST',
                body: post,
            }),
            invalidatesTags: ['Posts']
        })
    })
})


export const { useGetAllPostsQuery, useCreatePostMutation, useDeletePostMutation } = PostApi