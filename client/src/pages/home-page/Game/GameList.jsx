import { useEffect, useState } from "react";
import { fetchGamesCatalog } from "../../../services/catalogService";
import SearchBox from "../SearchBox/SearchBox";
import Filter from "../SearchBox/Filter";
import Game from "./Game";
import GameDetails from "../../../components/GameDetails";
import "./GameList.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
const GameList = () => {
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGame, setSelectedGame] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    availability: "all",
    platform: "",
    genre: "",
  });

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setShowFilterModal(false);
  };

  const handleGameClick = (game) => {
    setSelectedGame(game);
  };

  const handleCloseModal = () => {
    setSelectedGame(null);
  };

  useEffect(() => {
    const loadCatalog = async () => {
      const { data, error } = await fetchGamesCatalog();
      if (error) console.error(error);
      else setCatalog(data);
      setLoading(false);
    };
    loadCatalog();
  }, []);

  const filtered = catalog
    .filter((game) =>
      game.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((game) => {
      if (filters.availability === "available" && !game.available) return false;
      if (filters.platform && game.platform !== filters.platform) return false;
      if (filters.genre && game.genre !== filters.genre) return false;
      return true;
    });

  if (loading) return <p>Loading Games...</p>;

  return (
    <div className="game-list-component">
      <h2>Browse Games</h2>
      <div className="search-component">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <button className="filter-btn" onClick={() => setShowFilterModal(true)}>
          <FontAwesomeIcon className="filter-icon" icon={faFilter} />
        </button>
      </div>
      <div className="game-grid">
        {filtered.map((game) => (
          <Game key={game.id} game={game} onClick={handleGameClick} />
        ))}
      </div>
      {selectedGame && (
        <GameDetails catalogGame={selectedGame} onClose={handleCloseModal} />
      )}
      {showFilterModal && (
        <Filter
          currentFilters={filters}
          onClose={() => setShowFilterModal(false)}
          onApply={handleApplyFilters}
        />
      )}
    </div>
  );
};

export default GameList;
