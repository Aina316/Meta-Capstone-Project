import "../App.css";

export default function RecommendationModal({ recommendations, onClose }) {
  return (
    <div className="recommendation-modal-overlay">
      <div className="recommendation-modal">
        <h2>Recommended Games For You</h2>
        <div className="recommendations-grid">
          {recommendations.slice(0, 3).map((game) => (
            <div key={game.id} className="recommendation-card">
              <img src={game.catalog?.cover_image} alt={game.catalog?.title} />
              <h3>{game.catalog?.title}</h3>
              <p>
                <strong>Platform:</strong> {game.catalog?.platform}
              </p>
              <p>
                <strong>Genres:</strong> {game.catalog?.genre}
              </p>
            </div>
          ))}
        </div>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
