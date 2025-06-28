import { useEffect, useState } from "react";
import { fetchGamesCatalog } from "../../../services/catalogService";
import SearchBox from "../SearchBox/SearchBox";
import Game from "./Game";
import "./GameList.css";

export default function GameList() {
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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
        {filtered.length === 0 ? (
          <p> No games found matching "{searchQuery}"</p>
        ) : (
          filtered.map((game) => <Game key={game.id} game={game} />)
        )}
      </div>
    </div>
  );
}
