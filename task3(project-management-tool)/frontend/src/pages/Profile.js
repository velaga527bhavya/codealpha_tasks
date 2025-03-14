import React, { useEffect, useState } from 'react';
import { getUserProfile, getUserPosts, followUser } from '../api';

const Profile = () => {
  const [profile, setProfile] = useState({});
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    async function fetchProfile() {
      const userId = localStorage.getItem('userId');
      const res = await getUserProfile(userId);
      setProfile(res.data);
      const postsRes = await getUserPosts(userId);
      setPosts(postsRes.data);
      if (res.data._id !== currentUserId) {
        setIsFollowing(res.data.followers.includes(currentUserId));
      }
    }
    fetchProfile();
  }, [currentUserId]);

  const handleFollow = async () => {
    try {
      await followUser(profile._id);
      setIsFollowing(prev => !prev);
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
      {profile._id && profile._id !== currentUserId && (
        <button onClick={handleFollow} className="follow-button">
          {isFollowing ? 'Unfollow' : 'Follow'}
        </button>
      )}
      <h2>{profile._id === currentUserId ? 'Your Posts' : `${profile.username}'s Posts`}</h2>
      {posts.map((post) => (
        <div key={post._id} className="post-card">
          <p>{post.content}</p>
          <p>Likes: {post.likes.length}</p>
        </div>
      ))}
    </div>
  );
};

export default Profile;
