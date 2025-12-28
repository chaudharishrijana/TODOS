import { useState, useEffect } from 'react';

function Search({ onSearch }) {
  const [query, setQuery] = useState('');
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timer]);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    if (timer) clearTimeout(timer);
    
    const newTimer = setTimeout(() => {
      onSearch(value);
    }, 500);
    
    setTimer(newTimer);
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('');
    if (timer) clearTimeout(timer);
  };

  return (
    <div className="search">
      <div className="search-box">
        <input
          type="text"
          placeholder="Search tasks..."
          value={query}
          onChange={handleChange}
        />
        {query && (
          <button onClick={clearSearch} className="clear-btn">
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

export default Search;