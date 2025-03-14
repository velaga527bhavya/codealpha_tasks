import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Attach token to every request if available
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  // Optional: log headers to verify the token is attached
  console.log('Request headers:', req.headers);
  return req;
});
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Optionally clear token and redirect to login
      localStorage.removeItem('token');
      // You can add a redirect here if needed, e.g., using window.location or a navigation function
    }
    return Promise.reject(error);
  }
);


// Authentication
export const loginUser = (userData) => API.post('/auth/login', userData);
export const signupUser = (userData) => API.post('/auth/signup', userData);

// Posts
export const getPosts = () => API.get('/posts');
export const createPost = (postData) => 
  API.post('/posts', postData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
export const likePost = (postId) => API.put(`/posts/like/${postId}`);
export const addComment = (postId, text) => API.put(`/posts/comment/${postId}`, { text });

// User Profile
export const getUserProfile = (userId) => API.get(`/users/${userId}`);
export const getUserPosts = (userId) => API.get(`/posts/user/${userId}`);

// Notifications
export const getNotifications = () => API.get('/notifications');
export const markNotificationRead = (id) => API.put(`/notifications/${id}`);

// Add follow/unfollow endpoint call
export const followUser = (userId) => API.put(`/users/follow/${userId}`);

// Chat / Messages
export const getMessages = (userId) => API.get(`/messages/${userId}`);
export const sendMessage = (data) => API.post('/messages', data);
export const getUserByUsername = (username) => API.get(`/users/username/${username}`);


export default API;



