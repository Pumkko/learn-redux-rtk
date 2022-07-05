
import {Post as PostModel} from './models/Post'
import './posts.css'

interface PostProps {
    post: PostModel
}

const Post: React.FC<PostProps> = ({post}: PostProps) => {


    return (
        <div className='post-container'>
            <div className='post-title'>
                <span>{post.title}</span>
                <span>{new Date(post.creationDate).toDateString()}</span>
            </div>
            <div>{post.content}</div>
            <button onClick={() => {
                console.log(post.id)
            }}>Delete</button>
        </div>
    )

}

export default Post;