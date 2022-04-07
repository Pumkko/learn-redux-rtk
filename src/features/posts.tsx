
import {Post as PostModel} from './models/Post'
import './posts.css'

interface PostProps {
    post: PostModel
}

const Post: React.FC<PostProps> = (props) => {

    return (
        <div className='post-container'>
            <div className='post-title'>
                <span>{props.post.title}</span>
                <span>{props.post.createDate.toDateString()}</span>
            </div>
            <div>{props.post.content}</div>
            <button>Delete</button>
        </div>
    )

}

export default Post;