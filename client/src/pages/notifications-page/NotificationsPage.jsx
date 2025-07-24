import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import { fetchCatalogGameById } from "../../services/catalogService";
import {
  fetchNotificationsForUser,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../../services/notificationService";
import RecommendationModal from "../../components/RecommendationModal";
import { recommendGamesForUser } from "../../services/recommendationService";
import RateBorrowerModal from "../../components/RateBorrowerModal";
import "./NotificationsPage.css";

const NotificationsPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRecommendationModal, setShowRecommendationModal] = useState(false);
  const [modalRecommendations, setModalRecommendations] = useState([]);
  const [showRateBorrowerModal, setShowRateBorrowerModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedBorrower, setSelectedBorrower] = useState(null);
  const [selectedNotificationId, setSelectedNotificationId] = useState(null);
  const loadNotifications = async () => {
    setLoading(true);
    if (!user) return;
    const { data, error } = await fetchNotificationsForUser(user.id);
    if (!error) setNotifications(data);
    setLoading(false);
  };

  useEffect(() => {
    loadNotifications();
  }, [user]);

  const handleMarkAsRead = async (id) => {
    const notif = notifications.find((n) => n.id === id);
    await markNotificationAsRead(id);
    loadNotifications();

    if (notif?.type === "declined") {
      try {
        const referenceCatalogId = notif.catalog_id || notif.game_id;
        let referenceGame = null;

        if (referenceCatalogId) {
          const { data } = await fetchCatalogGameById(referenceCatalogId);
          if (data) referenceGame = { catalog: data };
        }
        const recs = await recommendGamesForUser(user.id, 10, referenceGame, [
          referenceCatalogId,
        ]);
        if (recs.length > 0) {
          setModalRecommendations(recs);
          setShowRecommendationModal(true);
        }
      } catch (err) {
        throw err;
      }
    }

    if (notif?.type === "rate_borrower") {
      setSelectedRequest(notif.request_id);
      setSelectedBorrower(notif.borrower_id);
      setSelectedNotificationId(notif.id);
      setShowRateBorrowerModal(true);
    }
  };

  const handleMarkAll = async () => {
    await markAllNotificationsAsRead(user.id);
    loadNotifications();
  };

  return (
    <div className="notifications-page">
      <Header />
      <h2>Notifications</h2>
      {loading ? (
        <p>Loading...</p>
      ) : notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        <>
          <button className="mark-all-btn" onClick={handleMarkAll}>
            Mark All as Read
          </button>
          <ul className="notifications-list">
            {notifications.map((n) => (
              <li key={n.id} className={n.read ? "read" : "unread"}>
                <div className="notification-message">{n.message}</div>

                {n.type === "declined" && !n.read && (
                  <button
                    className="see-similar-btn"
                    onClick={async () => {
                      const { data } = await fetchCatalogGameById(n.catalog_id);
                      const recs = await recommendGamesForUser(
                        user.id,
                        10,
                        { catalog: data },
                        [n.catalog_id]
                      );
                      setModalRecommendations(recs.slice(3));
                      setShowRecommendationModal(true);
                    }}
                  >
                    Show Me Similar Games
                  </button>
                )}

                {n.type === "rate_borrower" && !n.read && (
                  <button
                    className="rate-borrower-btn"
                    onClick={() => {
                      setSelectedRequest(n.request_id);
                      setSelectedBorrower(n.borrower_id);
                      setSelectedNotificationId(n.id);
                      setShowRateBorrowerModal(true);
                    }}
                  >
                    Rate Borrower
                  </button>
                )}

                <div className="notification-meta">
                  <span>{new Date(n.created_at).toLocaleString()}</span>
                  {!n.read && (
                    <button
                      className="mark-read-btn"
                      onClick={() => handleMarkAsRead(n.id)}
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {showRecommendationModal && (
        <RecommendationModal
          recommendations={modalRecommendations}
          onClose={() => setShowRecommendationModal(false)}
        />
      )}

      {showRateBorrowerModal && (
        <RateBorrowerModal
          requestId={selectedRequest}
          borrowerId={selectedBorrower}
          notificationId={selectedNotificationId}
          onClose={() => {
            setShowRateBorrowerModal(false);
            loadNotifications();
          }}
        />
      )}
    </div>
  );
};

export default NotificationsPage;
