import { useEffect, useState } from "react";
import {
  fetchGamesCatalog,
  fetchAvailableCatalogIds,
} from "../../../services/catalogService";
import { logEngagement } from "../../../services/engagementService";
import { useAuth } from "../../../context/authContext";
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
  const [selectedAvailability, setSelectedAvailability] = useState("");
  const [availableCatalogIds, setAvailableCatalogIds] = useState([]);
  const { user } = useAuth();

  const handleGameClick = async (game) => {
    if (user && game.id) {
      await logEngagement(user.id, game.id, "click");
    }
    setSelectedGame(game);
  };

  const handleCloseModal = () => {
    setSelectedGame(null);
  };

  useEffect(() => {
    const loadCatalog = async () => {
      const { data, error } = await fetchGamesCatalog();
      if (error) return;
      else setCatalog(data);
      setLoading(false);
    };
    loadCatalog();
  }, []);

  const handleApplyFilters = () => {
    setShowFilterModal(false);
  };
  useEffect(() => {
    const loadAvailableIds = async () => {
      const ids = await fetchAvailableCatalogIds();
      setAvailableCatalogIds(ids || []);
    };
    loadAvailableIds();
  }, []);

  const filtered = catalog.filter((game) => {
    const matchesSearch = game.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesGenre =
      selectedGenre === "" || game.genre.includes(selectedGenre);
    const matchesPlatform =
      selectedPlatform === "" || game.platform.includes(selectedPlatform);

    const matchesAvailability =
      selectedAvailability === "" ||
      (selectedAvailability === "Available" &&
        availableCatalogIds.includes(game.id)) ||
      (selectedAvailability === "Not Available" &&
        !availableCatalogIds.includes(game.id));

    return (
      matchesSearch && matchesGenre && matchesPlatform && matchesAvailability
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
          selectedAvailability={selectedAvailability}
          setSelectedAvailability={setSelectedAvailability}
          onClose={() => setShowFilterModal(false)}
          onApply={handleApplyFilters}
        />
      )}
    </div>
  );
};

export default GameList;
