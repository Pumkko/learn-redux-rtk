
import {Post as PostModel} from './models/Post'
import { useDeletePostMutation } from './postApi';
import './posts.css'

interface PostProps {
    post: PostModel
}

const Post: React.FC<PostProps> = (props) => {

    const [deletePost] = useDeletePostMutation();

    return (
        <div className='post-container'>
            <div className='post-title'>
                <span>{props.post.title}</span>
                <span>{new Date(props.post.creationDate).toDateString()}</span>
            </div>
            <div>{props.post.content}</div>
            <button onClick={async () => {
                deletePost(props.post.id)
            }}>Delete</button>
        </div>
    )

}

export default Post;