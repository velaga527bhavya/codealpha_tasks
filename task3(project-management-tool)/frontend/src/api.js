import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});
// Axios interceptor to attach token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});
// Auth endpoints
export const loginUser = (userData) => API.post('/auth/login', userData);
export const signupUser = (userData) => API.post('/auth/signup', userData);

// Projects endpoints (for project management)
export const getProjects = () => API.get('/projects');
export const createProject = (projectData) => API.post('/projects', projectData);

// Tasks endpoints
export const createTask = (taskData) => API.post('/tasks', taskData);
export const updateTask = (taskId, taskData) => API.put(`/tasks/${taskId}`, taskData);
export const addComment = (taskId, commentText) => API.put(`/tasks/${taskId}/comment`, { text: commentText });

// Notifications endpoint (if available)
export const getNotifications = () => API.get('/notifications');

// Chat endpoints (if implemented)
export const getMessages = (userId) => API.get(`/messages/${userId}`);
export const sendMessage = (data) => API.post('/messages', data);
export const getUserByUsername = (username) => API.get(`/users/username/${username}`);

// Posts endpoints
export const getPosts = () => API.get('/posts');
export const createPost = (postData) => API.post('/posts', postData);
export const likePost = (postId) => API.put(`/posts/like/${postId}`);
export const followUser = (userId) => API.put(`/users/follow/${userId}`);

// New endpoints for Profile page
export const getUserProfile = (userId) => API.get(`/users/${userId}`);
export const getUserPosts = (userId) => API.get(`/posts/user/${userId}`);
export const addTaskComment = (taskId, commentText) => API.put(`/tasks/${taskId}/comment`, { text: commentText });

// Tasks endpoints (add these if not already present)
export const getTasksByProject = (projectId) => API.get(`/tasks/project/${projectId}`);


export default API;


