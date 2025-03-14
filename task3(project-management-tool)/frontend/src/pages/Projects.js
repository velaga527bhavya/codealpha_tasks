import React, { useState, useEffect } from 'react';
import { 
  getProjects, 
  createProject, 
  getTasksByProject, 
  createTask, 
  addTaskComment, 
  getUserByUsername 
} from '../api';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [projectImage, setProjectImage] = useState(null);
  
  // We'll store tasks per project in an object keyed by project ID
  const [tasksByProject, setTasksByProject] = useState({});
  // For new task fields per project
  const [newTaskFields, setNewTaskFields] = useState({});
  // For new comment text per task (nested by project id, then task id)
  const [newCommentFields, setNewCommentFields] = useState({});

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await getProjects();
        setProjects(res.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    }
    fetchProjects();
  }, []);

  const handleProjectImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProjectImage(e.target.files[0]);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    try {
      // Use FormData to send project info including image
      const formData = new FormData();
      formData.append('name', newProjectName);
      formData.append('description', newProjectDesc);
      if (projectImage) {
        formData.append('image', projectImage);
      }
      
      const res = await createProject(formData);
      setProjects([res.data, ...projects]);
      setNewProjectName('');
      setNewProjectDesc('');
      setProjectImage(null);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  // Fetch tasks for a given project
  const handleShowTasks = async (projectId) => {
    try {
      const res = await getTasksByProject(projectId);
      setTasksByProject((prev) => ({ ...prev, [projectId]: res.data }));
    } catch (error) {
      console.error(`Error fetching tasks for project ${projectId}:`, error);
    }
  };

  // Handle changes for new task fields for a project
  const handleTaskFieldChange = (projectId, field, value) => {
    setNewTaskFields((prev) => ({
      ...prev,
      [projectId]: { ...prev[projectId], [field]: value },
    }));
  };

  // Create a new task for a project (assignment is done by username)
  const handleCreateTask = async (projectId) => {
    const { title, description, assignedTo } = newTaskFields[projectId] || {};
    if (!title.trim()) return; // Title is required

    try {
      let assignedUserId;
      if (assignedTo && assignedTo.trim() !== '') {
        const userRes = await getUserByUsername(assignedTo);
        assignedUserId = userRes.data._id;
      }
      const taskData = { title, description, project: projectId };
      if (assignedUserId) {
        taskData.assignedTo = assignedUserId;
      }
      const res = await createTask(taskData);
      setTasksByProject((prev) => ({
        ...prev,
        [projectId]: prev[projectId] ? [res.data, ...prev[projectId]] : [res.data],
      }));
      setNewTaskFields((prev) => ({ ...prev, [projectId]: {} }));
    } catch (error) {
      console.error(`Error creating task for project ${projectId}:`, error);
    }
  };

  // Handle changes for new comment fields for a task within a project
  const handleCommentFieldChange = (projectId, taskId, value) => {
    setNewCommentFields((prev) => ({
      ...prev,
      [projectId]: { ...prev[projectId], [taskId]: value },
    }));
  };

  // Add a comment to a task
  const handleAddTaskComment = async (projectId, taskId) => {
    const commentText = newCommentFields[projectId]?.[taskId];
    if (!commentText?.trim()) return;
    try {
      const res = await addTaskComment(taskId, commentText);
      // Update tasks for the project: find the task and update its comments
      setTasksByProject((prev) => {
        const updatedTasks = prev[projectId].map((task) =>
          task._id === taskId ? res.data : task
        );
        return { ...prev, [projectId]: updatedTasks };
      });
      setNewCommentFields((prev) => ({
        ...prev,
        [projectId]: { ...prev[projectId], [taskId]: '' },
      }));
    } catch (error) {
      console.error(`Error adding comment to task ${taskId}:`, error);
    }
  };

  return (
    <div className="container">
      <h1>Projects</h1>
      <form onSubmit={handleCreateProject}>
        <input
          type="text"
          placeholder="Project Name"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
        /><br/>
        <textarea
          placeholder="Project Description"
          value={newProjectDesc}
          onChange={(e) => setNewProjectDesc(e.target.value)}
        /><br/>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleProjectImageChange} 
        /><br/>
        <button type="submit">Create Project</button>
      </form>
      <hr/>
      {projects.map((project) => (
        <div key={project._id} className="post-card">
          <h2>{project.name}</h2>
          <p>{project.description}</p>
          <p>Created By: {project.createdBy.username || project.createdBy}</p>
          <button onClick={() => handleShowTasks(project._id)}>
            Show Tasks
          </button>
          {/* Display tasks for this project */}
          {tasksByProject[project._id] && (
            <div style={{ marginTop: '10px' }}>
              <h3>Tasks</h3>
              {tasksByProject[project._id].map((task) => (
                <div key={task._id} style={{ border: '1px solid #ccc', margin: '5px 0', padding: '5px' }}>
                  <p><strong>{task.title}</strong> (Status: {task.status})</p>
                  <p>{task.description}</p>
                  <p>Assigned To: {task.assignedTo ? task.assignedTo.username || task.assignedTo : 'Unassigned'}</p>
                  {/* Task comments */}
                  {task.comments && task.comments.length > 0 && (
                    <div style={{ marginLeft: '10px' }}>
                      <h4>Comments:</h4>
                      {task.comments.map((comment, index) => (
                        <p key={index}>
                          <strong>{comment.postedBy?.username || 'Unknown'}</strong>: {comment.text}
                        </p>
                      ))}
                    </div>
                  )}
                  {/* Form to add a comment for this task */}
                  <div style={{ marginLeft: '10px' }}>
                    <input
                      type="text"
                      placeholder="Add a comment"
                      value={newCommentFields[project._id]?.[task._id] || ''}
                      onChange={(e) => handleCommentFieldChange(project._id, task._id, e.target.value)}
                    />
                    <button onClick={() => handleAddTaskComment(project._id, task._id)}>
                      Submit Comment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Form to create a new task for this project */}
          <div style={{ marginTop: '15px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
            <h3>Create Task</h3>
            <input
              type="text"
              placeholder="Task Title"
              value={newTaskFields[project._id]?.title || ''}
              onChange={(e) => handleTaskFieldChange(project._id, 'title', e.target.value)}
            /><br/>
            <textarea
              placeholder="Task Description"
              value={newTaskFields[project._id]?.description || ''}
              onChange={(e) => handleTaskFieldChange(project._id, 'description', e.target.value)}
            /><br/>
            <input
              type="text"
              placeholder="Assigned To (Username)"
              value={newTaskFields[project._id]?.assignedTo || ''}
              onChange={(e) => handleTaskFieldChange(project._id, 'assignedTo', e.target.value)}
            /><br/>
            <button onClick={() => handleCreateTask(project._id)}>Create Task</button>
          </div>
          <hr/>
        </div>
      ))}
    </div>
  );
};

export default Projects;



