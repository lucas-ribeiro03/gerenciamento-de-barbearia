/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect } from "react";
import styles from "./style.module.scss";
import { ProfileContext } from "../../../context/ProfileContext";

interface ProfileProps {
  onClose: () => void;
}

const Profile: React.FC<ProfileProps> = () => {
  const { user, getUser } = useContext(ProfileContext);

  useEffect(() => {
    getUser();
  }, []);
  console.log(user);

  return <div className={styles.modal}></div>;
};

export default Profile;
