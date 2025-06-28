import { useContext, useEffect } from "react";
import styles from "./style.module.scss";
import { ProfileContext } from "../../../context/ProfileContext";

interface ProfileProps {
  onClose: () => void;
}

const Profile: React.FC<ProfileProps> = ({ onClose }) => {
  const { user, getUser } = useContext(ProfileContext);

  useEffect(() => {
    getUser();
  }, []);
  console.log(user);

  return <div></div>;
};

export default Profile;
