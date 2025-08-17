import React from "react";
import UpdateProfile from "./UpdateProfile";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

const ProfilePage = ({ user, setUser }) => {
  const { t } = useTranslation();
  useEffect(() => {
    document.title = t('profile.title', 'Profile - MediMart');
  }, [t]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <UpdateProfile user={user} onUpdate={setUser} />
    </div>
  );
};

export default ProfilePage;
