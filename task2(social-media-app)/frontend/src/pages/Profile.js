import React, { useEffect, useState } from 'react';
import { getUserProfile, getUserPosts, followUser } from '../api';

const Profile = () => {
  const [profile, setProfile] = useState({});
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);

  // Get the current user's ID from localStorage
  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    async function fetchProfile() {
      // Assuming userId is saved in localStorage after login.
      // Here, we're loading the current user's profile. You can modify this logic
      // to use a URL parameter (via useParams) if you wish to view other profiles.
      const userId = localStorage.getItem('userId');
      const res = await getUserProfile(userId);
      setProfile(res.data);
      const postsRes = await getUserPosts(userId);
      setPosts(postsRes.data);
      
      // If viewing another user's profile, check if current user is following them.
      // In this example, since we're loading the current user's profile,
      // the follow button will not show. Modify this logic if you support multiple profiles.
      if (res.data._id !== currentUserId) {
        setIsFollowing(res.data.followers.includes(currentUserId));
      }
    }
    fetchProfile();
  }, [currentUserId]);

  const handleFollow = async () => {
    try {
      await followUser(profile._id);
      // Toggle follow status locally
      setIsFollowing(prev => !prev);
      // Update the followers count locally
      setProfile(prevProfile => {
        let updatedFollowers;
        if (!isFollowing) {
          updatedFollowers = [...prevProfile.followers, currentUserId];
        } else {
          updatedFollowers = prevProfile.followers.filter(id => id !== currentUserId);
        }
        return { ...prevProfile, followers: updatedFollowers };
      });
    } catch (error) {
      console.error('Error toggling follow status:', error);
    }
  };

  return (
    <div className="profile-container">
      <h1>{profile.username}'s Profile</h1>
      <p>Email: {profile.email}</p>
      <p>
        Followers: {profile.followers?.length || 0} | Following: {profile.following?.length || 0}
      </p>
      {/* Show the follow button if viewing another user's profile */}
      {profile._id && profile._id !== currentUserId && (
        <button onClick={handleFollow}>
          {isFollowing ? 'Unfollow' : 'Follow'}
        </button>
      )}
      <h2>{profile._id === currentUserId ? 'Your Posts' : `${profile.username}'s Posts`}</h2>
      {posts.map((post) => (
        <div key={post._id} style={{ border: '1px solid #ccc', margin: '1rem 0' }}>
          <p>{post.content}</p>
          <p>Likes: {post.likes.length}</p>
        </div>
      ))}
    </div>
  );
};

export default Profile;






