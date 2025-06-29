import { useState } from "react";
import { uploadAvatar } from "../../services/uploadAvatar";
import { supabase } from "../../services/supabaseClient";

const AvatarUpdate = ({ onUpload }) => {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { error, url } = await uploadAvatar(file, user.id);
    if (!error) onUpload(url);
    else alert("Upload failed");
  };

  return (
    <div className="avatar-update">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        accept="image/*"
      />
      <button onClick={handleUpload}>Upload Avatar</button>
    </div>
  );
};

export default AvatarUpdate;
