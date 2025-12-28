function Filter({ currentFilter, onFilterChange }) {
  const filters = [
    { id: 'all', label: 'All', icon: '📋' },
    { id: 'pending', label: 'Pending', icon: '⏳' },
    { id: 'done', label: 'Completed', icon: '✅' }
  ];

  return (
    <div className="filter">
      <div className="filter-buttons">
        {filters.map(filter => (
          <button
            key={filter.id}
            className={`filter-btn ${currentFilter === filter.id ? 'active' : ''}`}
            onClick={() => onFilterChange(filter.id)}
          >
            {filter.icon} {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Filter;