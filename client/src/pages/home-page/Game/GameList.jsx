import { useEffect, useState } from "react";
import { fetchGamesCatalog } from "../../../services/catalogService";
import SearchBox from "../SearchBox/SearchBox";
import Game from "./Game";
import GameDetails from "../../../components/GameDetails";
import "./GameList.css";

export default function GameList() {
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGame, setSelectedGame] = useState(null);

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
  const filtered = catalog.filter((game) =>
    game.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  if (loading) return <p>Loading Games...</p>;
  return (
    <div className="game-list-component">
      <h2>Browse Games</h2>
      <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="game-grid">
        {filtered.map((game) => (
          <Game key={game.id} game={game} onClick={handleGameClick} />
        ))}
      </div>
      <GameDetails game={selectedGame} onClose={handleCloseModal} />
    </div>
  );
}
