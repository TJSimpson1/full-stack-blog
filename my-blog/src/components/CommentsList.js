import useUser from "../hooks/useUser";

const CommentsList = ({ comments, deleteComment }) => {

    const { user } = useUser();

    return (
        <>
        <h3>Comments: </h3>
        {comments.map(comment => (
            <div className="comment" key={comment.postedBy + ': ' + comment.text}>
                <h4>{comment.postedBy}</h4>
                {user && user.email === comment.postedBy && <div className="comment-right"><button className="comment-button">Edit</button> <span>|</span> <button className="delete-link comment-button" onClick={() => deleteComment(comment.text)}>Delete</button></div>}
                <p>{comment.text}</p>
            </div>
        ))}
        </>
    )
    
};

export default CommentsList;