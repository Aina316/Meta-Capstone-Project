import "./SearchBox.css";

const SearchBox = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="search-filter-component">
      <div className="search-component">
        <input
          value={searchQuery}
          type="text"
          placeholder="Search for Games..."
          className="search-bar"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="search-box-button">
          <button>Search</button>
          <button>Clear</button>
        </div>
      </div>
    </div>
  );
};

export default SearchBox;
