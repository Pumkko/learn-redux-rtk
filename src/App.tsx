import React from 'react';
import './App.css';
import Post from './features/posts';
import {Post as PostModel} from './features/models/Post'
import AddPost from './features/addPost';

function App() {

  const posts: PostModel[] = [
    {
      id: 1,
      title: 'New strings',
      content: 'Got a new set of strings for the violin',
      createDate: new Date(2022,14,22,10,50,0)
    },
    {
      id: 2,
      title: 'broke the E string (again)',
      content: 'Yeah so i was playing mendelssohn violin concerto and out of nowhere my E string broke...',
      createDate: new Date(2022,14,22,10,30,0)
    }
  ]
  


  return (
    <div className="App">

      <AddPost></AddPost>
      {
        posts.map(p => <Post key={p.id} post={p}></Post>)
      }
    </div>
  );
}

export default App;
