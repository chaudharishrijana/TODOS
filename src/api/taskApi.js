
const API_URL ="https://694e696db5bc648a93c04c47.mockapi.io/api/v1/tasks/"


// 
const apiRequest = async (endpoint = '', method = 'GET', data = null) => {
  const url = `${API_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error.message);
    throw error;
  }
};

// CRUD Operations
export const getTasks = () => apiRequest('');
export const getTask = (id) => apiRequest(`/${id}`);
export const createTask = (task) => apiRequest('', 'POST', task);
export const updateTask = (id, task) => apiRequest(`/${id}`, 'PUT', task);
export const deleteTask = (id) => apiRequest(`/${id}`, 'DELETE');