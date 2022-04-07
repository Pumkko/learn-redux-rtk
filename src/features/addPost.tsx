
import './posts.css'

const AddPost: React.FC = () => {
    return (
        <div className='post-container'>
            <div className='post-title'>
                <input type={'text'}/>
                <span>{new Date().toDateString()}</span>
            </div>
            <textarea className='content-text-area'></textarea>
            <button>Add</button>
        </div>
    )
}

export default AddPost;