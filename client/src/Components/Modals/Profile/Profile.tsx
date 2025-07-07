/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import styles from "./style.module.scss";
import { ProfileContext } from "../../../context/ProfileContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface ProfileProps {
  onClose: () => void;
}

const Profile: React.FC<ProfileProps> = ({ onClose }) => {
  const { user, getUser } = useContext(ProfileContext);
  const [nome, setNome] = useState("");
  const [username, setUsername] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    getUser();
    if (user) {
      setNome(user?.nome);
      setUsername(user?.username);
      setTel(user?.tel);
      setEmail(user?.email);
    }
  }, [user?.nome]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await axios
      .put(
        "http://localhost:3001/users",
        {
          nome,
          username,
          tel,
          email,
        },
        { headers: { accessToken: localStorage.getItem("token") } }
      )
      .then((response) => console.log(response));

    onClose();
    // navigate(0);
  };

  return (
    <div className={styles.modal}>
      <div className={styles.mdContainer}>
        <form className={styles.edit} onSubmit={(e) => onSubmit(e)}>
          <label htmlFor="nome">Nome</label>
          <input
            type="text"
            id="nome"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <label htmlFor="usename">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="tel">Tel</label>
          <input
            type="text"
            id="tel"
            maxLength={11}
            value={tel}
            onChange={(e) => setTel(e.target.value)}
          />

          <button>Salvar</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
