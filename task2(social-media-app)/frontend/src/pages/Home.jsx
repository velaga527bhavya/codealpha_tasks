import React, { useState, useEffect } from 'react';
import { getPosts, createPost, likePost, addComment, followUser } from '../api';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [image, setImage] = useState(null);
  const [activeComment, setActiveComment] = useState({});
  
  // Get the current logged-in user's ID from localStorage
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

  // Handler for file input change
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  // Handler for creating a new post with text and optional image
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

  // Handler for liking a post - updated to preserve the populated user object
  const handleLike = async (postId) => {
    try {
      const res = await likePost(postId);
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post._id === postId) {
            // Merge the updated data with the existing user details
            return { ...res.data, user: post.user };
          }
          return post;
        })
      );
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  // Handler for adding a comment to a post
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

  // Handler for comment input change
  const handleCommentChange = (postId, value) => {
    setActiveComment({ ...activeComment, [postId]: value });
  };

  // Handler for following/unfollowing a user
  const handleFollow = async (userId) => {
    try {
      await followUser(userId);
      // Update the follow status in all posts by that user
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.user._id === userId) {
            let updatedFollowers = post.user.followers ? [...post.user.followers] : [];
            if (updatedFollowers.includes(currentUserId)) {
              // Unfollow: remove current user's ID
              updatedFollowers = updatedFollowers.filter(id => id !== currentUserId);
            } else {
              // Follow: add current user's ID
              updatedFollowers.push(currentUserId);
            }
            return { ...post, user: { ...post.user, followers: updatedFollowers } };
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
      {/* New post form with text and image upload */}
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
      {/* Display posts */}
      {posts.map((post) => (
        <div key={post._id} className="post-card">
          <div className="post-header" style={{ display: 'flex', alignItems: 'center' }}>
            {/* Display username */}
            <h3 style={{ margin: '0', fontWeight: 'bold' }}>
              {post.user.username}
            </h3>
            {/* Display follow button if the post's user is not the current user */}
            {post.user._id !== currentUserId && (
              <button 
                onClick={() => handleFollow(post.user._id)} 
                style={{ marginLeft: '10px' }}
              >
                {post.user.followers && post.user.followers.includes(currentUserId)
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
              Like ({post.likes.length})
            </button>
          </div>
          <div className="comment-section">
            <h4>Comments:</h4>
            {post.comments.map((comment, index) => (
              <div key={index} className="comment">
                <strong>{comment.user.username}</strong>: {comment.text}
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










