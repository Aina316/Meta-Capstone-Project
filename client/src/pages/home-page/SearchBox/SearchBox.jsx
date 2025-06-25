const SearchBox = () => {
  return (
    <div className="search-filter-component">
      <div className="search-component">
        <input
          type="text"
          placeholder="Search for Game"
          className="search-bar"
        />
        <div className="search-box-button">
          <button>Search</button>
          <button>Clear</button>
        </div>
      </div>
      <div className="filter"></div>
    </div>
  );
};
