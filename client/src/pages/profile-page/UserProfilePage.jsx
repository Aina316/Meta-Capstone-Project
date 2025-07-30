import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLoader } from "../../context/LoaderContext";
import { supabase } from "../../services/supabaseClient";
import Header from "../../components/Header";
import image from "../../assets/images/default_avatar.jpg";
import "./ProfilePage.css";

const UserProfilePage = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const { setLoading } = useLoader();
  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        throw error;
      } else {
        setProfile(data);
      }
      setLoading(false);
    };

    loadProfile();
  }, [userId]);

  if (!profile) return <p>User not found.</p>;

  return (
    <div className="profilepage-component">
      <Header />

      <div className="profilepage-content">
        <h2>{profile.username}'s Profile</h2>
        <img src={profile.image || image} alt="Avatar" />
        <p className="profile-bio">{profile.bio}</p>
        <p className="profile-location">Location: {profile?.location}</p>

        {profile.favorite_genres && profile.favorite_genres.length > 0 && (
          <div className="profile-favorites">
            <p>
              <strong>Favorite Genres:</strong>{" "}
              {profile.favorite_genres.join(", ")}
            </p>
          </div>
        )}

        {profile.favorite_platforms &&
          profile.favorite_platforms.length > 0 && (
            <div className="profile-favorites">
              <p>
                <strong>Favorite Platforms:</strong>{" "}
                {profile.favorite_platforms.join(", ")}
              </p>
            </div>
          )}
        <button
          onClick={() => (window.location.href = `/profile/${userId}/library`)}
          className="view-library-btn"
        >
          View {profile.username}'s Game Library
        </button>
        <div className="profile-scores">
          <p>
            <strong>Lender Score:</strong> {profile.lender_score}
          </p>
          <p>
            <strong>Borrower Score:</strong> {profile.borrower_score}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
