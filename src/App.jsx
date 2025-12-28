import { useState, useEffect } from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import Filter from './components/Filter';
import Search from './components/Search';
import { getTasks, createTask, updateTask, deleteTask } from './api/taskApi';
import './styles.css';

function App() {
  // State
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [currentFilter, setCurrentFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('dueDate');
  const [sortOrder, setSortOrder] = useState('asc');
  
  const [editingTask, setEditingTask] = useState(null);

  // Load tasks
  useEffect(() => {
    fetchTasks();
  }, []);

  // Apply filters
  useEffect(() => {
    filterAndSortTasks();
  }, [tasks, currentFilter, searchQuery, sortBy, sortOrder]);

  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setError('Failed to load tasks. Please check your connection.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter, search, and sort
  const filterAndSortTasks = () => {
    let result = [...tasks];

    // Filter by status
    if (currentFilter !== 'all') {
      result = result.filter(task => task.status === currentFilter);
    }

    // Search
    if (searchQuery) {
      result = result.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    result.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (sortBy === 'dueDate') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }

      return sortOrder === 'asc' 
        ? (aVal > bVal ? 1 : -1)
        : (aVal < bVal ? 1 : -1);
    });

    setFilteredTasks(result);
  };

  // Add/Update task
  const handleSubmitTask = async (taskData) => {
    try {
      setError('');
      
      if (editingTask) {
        const updated = await updateTask(editingTask.id, taskData);
        setTasks(tasks.map(t => t.id === editingTask.id ? updated : t));
        setEditingTask(null);
      } else {
        const newTask = await createTask(taskData);
        setTasks([...tasks, newTask]);
      }
    } catch (err) {
      setError('Failed to save task. Please try again.');
      console.error('Error:', err);
    }
  };

  // Delete task
  const handleDeleteTask = async (id) => {
    if (!confirm('Delete this task?')) return;
    
    try {
      setError('');
      await deleteTask(id);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      setError('Failed to delete task.');
      console.error('Error:', err);
    }
  };

  // Toggle status
  const handleToggleStatus = async (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const newStatus = task.status === 'pending' ? 'done' : 'pending';
    
    try {
      const updated = await updateTask(id, { ...task, status: newStatus });
      setTasks(tasks.map(t => t.id === id ? updated : t));
    } catch (err) {
      setError('Failed to update task.');
      console.error('Error:', err);
    }
  };

  // Statistics
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'done').length;
  const pending = total - completed;

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-top">
          <h1>📝 Task Tracker</h1>
          <p>Hello! I am your task buddy</p>
        </div>
        
        <div className="header-stats">
          <div className="stat">
            <span className="count">{total}</span>
            <span className="label">Total</span>
          </div>
          <div className="stat">
            <span className="count">{pending}</span>
            <span className="label">Pending</span>
          </div>
          <div className="stat">
            <span className="count">{completed}</span>
            <span className="label">Completed</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main">
        {/* Controls */}
        <div className="controls">
          <div className="left-controls">
            <Search onSearch={setSearchQuery} />
            <Filter 
              currentFilter={currentFilter}
              onFilterChange={setCurrentFilter}
            />
          </div>
          
          <div className="right-controls">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="dueDate">Due Date</option>
              <option value="title">Title</option>
              <option value="createdAt">Created</option>
            </select>
            
            <button
              onClick={() => setSortOrder(order => order === 'asc' ? 'desc' : 'asc')}
              className="sort-btn"
            >
              {sortOrder === 'asc' ? '↑ Asc' : '↓ Desc'}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error">
            {error}
            <button onClick={fetchTasks}>Retry</button>
          </div>
        )}

        {/* Content Grid */}
        <div className="content">
          {/* Left - Form */}
          <div className="left">
            <TaskForm
              onSubmit={handleSubmitTask}
              onCancel={() => setEditingTask(null)}
              editingTask={editingTask}
            />
            
            
          </div>

          {/* Right - Tasks */}
          <div className="right">
            <div className="tasks-header">
              <h2>
                {searchQuery ? 'Search Results' : 'All Tasks'} 
                <span className="count"> ({filteredTasks.length})</span>
              </h2>
              <button 
                onClick={fetchTasks}
                className="refresh-btn"
                disabled={loading}
              >
                🔄 
              </button>
            </div>

            <TaskList
              tasks={filteredTasks}
              onEdit={setEditingTask}
              onDelete={handleDeleteTask}
              onToggle={handleToggleStatus}
              loading={loading}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>No need to memorise every task on your little brain just add your task and open when you forget your task. </p>
      </footer>
    </div>
  );
}

export default App;