import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile } from "../../services/profileService";
import EditProfile from "./EditProfile";
import image from "/src/assets/images/default_avatar.jpg";
import Header from "../../components/Header";
import "./ProfilePage.css";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openEdit, setOpenEdit] = useState(false);
  const navigate = useNavigate();

  const loadProfile = () => {
    setLoading(true);
    getUserProfile()
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch(() => {
        alert("Error fetching profile");
        setLoading(false);
      });
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleProfileUpdated = () => {
    loadProfile();
    setOpenEdit(false);
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="profilepage-component">
      <Header />

      <div className="profilepage-content">
        <h2>My Profile</h2>
        <img src={profile.image || image} alt="Avatar" />
        <h3>{profile?.username}</h3>
        <p className="profile-bio">{profile?.bio}</p>
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
        <div className="profile-scores">
          <p>
            <strong>Lender Score:</strong> {profile.lender_score}
          </p>
          <p>
            <strong>Borrower Score:</strong> {profile.borrower_score}
          </p>
          <p>
            <strong>Reputation:</strong> ⭐ {profile.reputation?.toFixed(1)}
          </p>
        </div>
        <button onClick={() => setOpenEdit(true)}>Edit Profile</button>
        <button onClick={() => navigate("/library")}>Game Library</button>
      </div>
      {openEdit && (
        <EditProfile
          profile={profile}
          onClose={() => setOpenEdit(false)}
          onUpdatedProfile={handleProfileUpdated}
        />
      )}
    </div>
  );
};

export default ProfilePage;
