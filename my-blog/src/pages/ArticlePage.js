import { useParams } from "react-router-dom";
import articles from "./article-content";
import axios from 'axios';
import NotFoundPage from "./NotFoundPage";
import CommentsList from "../components/CommentsList";
import AddCommentForm from "../components/AddCommentForm";
import { useEffect, useState } from "react";
import useUser from "../hooks/useUser";
import { MathJax } from "better-react-mathjax";

const ArticlePage = () => {
    const [articleInfo, setArticleInfo] = useState({ upvotes: 0, comments: [], canUpvote: false });
    const { canUpvote } = articleInfo;
    const { articleId } = useParams();

    const { user, isLoading } = useUser();

    useEffect(() => {
        const loadArticleInfo = async () => {
            const token = user && await user.getIdToken();
            const headers = token ? {authtoken: token} : {};
            const response = await axios.get(`/api/articles/${articleId}`, { headers });
            const newArticleInfo = response.data;
            setArticleInfo(newArticleInfo);
        }
        if(isLoading){
            loadArticleInfo();
        }
    }, [isLoading, user, articleId]);

    const deleteComment = async (text) => {
        const token = user && await user.getIdToken();
        const headers = token ? {authtoken: token} : {}
        const response = await axios.delete(`/api/articles/${articleId}//comments`, {
            data: {
            postedBy: user.email,
            text: text,
        }, headers: { headers }
    });
    const newArticleInfo = response.data;
    setArticleInfo(newArticleInfo);
    }

    const article = articles.find(article => article.name === articleId);

    const addUpvote = async () => {
        const token = user && await user.getIdToken();
        const headers = token ? {authtoken: token} : {}
        const response = await axios.put(`/api/articles/${articleId}/upvote`, null, { headers });
        const updatedArticle = response.data;
        setArticleInfo(updatedArticle);
    }

    if(!article) {
        return (
            <NotFoundPage />
        );
    }

    return(
        <>
            <h1>{article.title}</h1>
            <div className="upvotes-section">
                {user
                    ? <button onClick={addUpvote}>{canUpvote ? 'Upvote' : 'Already upvoted'}</button>
                    : <button>Log in to upvote</button>}
                <p>This article has {articleInfo.upvotes} upvote(s)</p>
            </div>
            {article.content.map((paragraph, i) => (
                <MathJax key={i}><p>{paragraph}</p></MathJax>
            ))}
            {user
                ?   <AddCommentForm
                        articleName={articleId}
                        onArticleUpdated={updatedArticle => setArticleInfo(updatedArticle)} />
                : <button>Log in to comment</button>}
            <CommentsList comments={articleInfo.comments} deleteComment={deleteComment} />
        </>
    );
}

export default ArticlePage;