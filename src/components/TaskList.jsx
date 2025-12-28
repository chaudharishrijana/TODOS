import TaskItem from './TaskItem';

function TaskList({ tasks, onEdit, onDelete, onToggle, loading }) {
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading tasks from API...</p>
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="empty">
        <div className="empty-icon">📝</div>
        <h3>No tasks found</h3>
        <p>Add your first task using the form!</p>
      </div>
    );
  }

  const completed = tasks.filter(t => t.status === 'done').length;
  const pending = tasks.filter(t => t.status === 'pending').length;

  return (
    <div className="task-list-container">
      <div className="stats">
        <div className="stat">
          <span className="number">{tasks.length}</span>
          <span className="label">Total</span>
        </div>
        <div className="stat">
          <span className="number">{pending}</span>
          <span className="label">Pending</span>
        </div>
        <div className="stat">
          <span className="number">{completed}</span>
          <span className="label">Done</span>
        </div>
      </div>

      <div className="task-list">
        {tasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  );
}

export default TaskList;