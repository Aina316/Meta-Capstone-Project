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
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");

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

  const handleApplyFilters = () => {
    setShowFilterModal(false);
  };

  const filtered = catalog.filter((game) => {
    return (
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedGenre === "" || game.genre.includes(selectedGenre)) &&
      (selectedPlatform === "" || game.platform.includes(selectedPlatform))
    );
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
          selectedGenre={selectedGenre}
          setSelectedGenre={setSelectedGenre}
          selectedPlatform={selectedPlatform}
          setSelectedPlatform={setSelectedPlatform}
          onClose={() => setShowFilterModal(false)}
          onApply={handleApplyFilters}
        />
      )}
    </div>
  );
};

export default GameList;
