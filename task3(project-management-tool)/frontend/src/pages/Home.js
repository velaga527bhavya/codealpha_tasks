import React, { useState, useEffect } from 'react';
import { getPosts, createPost, likePost, addComment, followUser } from '../api';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [image, setImage] = useState(null);
  const [activeComment, setActiveComment] = useState({});
  
  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await getPosts();
        setPosts(res.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    }
    fetchPosts();
  }, []);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (newPost.trim() === '' && !image) return;
    
    const formData = new FormData();
    formData.append('content', newPost);
    if (image) {
      formData.append('image', image);
    }

    try {
      const res = await createPost(formData);
      setPosts([res.data, ...posts]);
      setNewPost('');
      setImage(null);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleLike = async (postId) => {
    try {
      const res = await likePost(postId);
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post._id === postId) {
            // Merge the returned data with the existing populated userId field
            return { ...res.data, userId: post.userId };
          }
          return post;
        })
      );
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleAddComment = async (postId) => {
    const commentText = activeComment[postId];
    if (!commentText) return;
    try {
      const res = await addComment(postId, commentText);
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === postId ? res.data : post))
      );
      setActiveComment({ ...activeComment, [postId]: '' });
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleCommentChange = (postId, value) => {
    setActiveComment({ ...activeComment, [postId]: value });
  };

  const handleFollow = async (userId) => {
    try {
      await followUser(userId);
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.userId?._id === userId) {
            let updatedFollowers = post.userId.followers ? [...post.userId.followers] : [];
            if (updatedFollowers.includes(currentUserId)) {
              updatedFollowers = updatedFollowers.filter(id => id !== currentUserId);
            } else {
              updatedFollowers.push(currentUserId);
            }
            return { ...post, userId: { ...post.userId, followers: updatedFollowers } };
          }
          return post;
        })
      );
    } catch (error) {
      console.error('Error toggling follow status:', error);
    }
  };

  return (
    <div className="container home-feed">
      <h1>Home Feed</h1>
      <form className="new-post-form" onSubmit={handleCreatePost}>
        <textarea
          placeholder="What's on your mind?"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />
        <br />
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageChange} 
        />
        <br />
        <button type="submit">Post</button>
      </form>
      <hr />
      {posts.map((post) => (
        <div key={post._id} className="post-card">
          <div className="post-header" style={{ display: 'flex', alignItems: 'center' }}>
            <h3 style={{ margin: '0', fontWeight: 'bold' }}>
              {post.userId?.username || 'Unknown User'}
            </h3>
            {post.userId?._id !== currentUserId && (
              <button 
                onClick={() => handleFollow(post.userId._id)} 
                style={{ marginLeft: '10px' }}
              >
                {post.userId?.followers?.includes(currentUserId)
                  ? 'Unfollow'
                  : 'Follow'}
              </button>
            )}
          </div>
          <div className="post-content">{post.content}</div>
          {post.image && (
            <div className="post-image">
              <img 
                src={post.image} 
                alt="Post" 
                style={{ maxWidth: '100%', borderRadius: '8px', marginTop: '10px' }} 
              />
            </div>
          )}
          <div className="post-actions">
            <button onClick={() => handleLike(post._id)}>
              Like ({post.likes?.length || 0})
            </button>
          </div>
          <div className="comment-section">
            <h4>Comments:</h4>
            {post.comments?.map((comment, index) => (
              <div key={index} className="comment">
                <strong>{comment.user?.username || 'Unknown'}</strong>: {comment.text}
              </div>
            ))}
            <input
              type="text"
              placeholder="Add a comment"
              value={activeComment[post._id] || ''}
              onChange={(e) => handleCommentChange(post._id, e.target.value)}
            />
            <button onClick={() => handleAddComment(post._id)}>
              Submit Comment
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;



