function TaskItem({ task, onEdit, onDelete, onToggle }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <div className={`task ${task.status} ${isOverdue ? 'overdue' : ''}`}>
      <div className="task-content">
        <div className="task-header">
          <h3>{task.title}</h3>
          <span className={`status ${task.status}`}>
            {task.status}
          </span>
        </div>
        
        {task.description && (
          <p className="description">{task.description}</p>
        )}
        
        <div className="task-footer">
          <div className="dates">
            <span className={`due-date ${isOverdue ? 'overdue' : ''}`}>
              📅 Due: {formatDate(task.dueDate)}
            </span>
            {task.createdAt && (
              <span className="created">
                Created: {formatDate(task.createdAt)}
              </span>
            )}
          </div>
          
          <div className="actions">
            <button 
              className={`toggle ${task.status === 'pending' ? 'complete' : 'undo'}`}
              onClick={() => onToggle(task.id)}
            >
              {task.status === 'pending' ? '✓' : '↩'}
            </button>
            <button className="edit" onClick={() => onEdit(task)}>
              ✏
            </button>
            <button className="delete" onClick={() => onDelete(task.id)}>
              🗑 
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskItem;