import { useContext, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import styles from "./style.module.scss";

import { AuthContext } from "../../context/AuthContext";
import Main from "../../Components/Main/Main";

const Home = () => {
  const { loading } = useContext(AuthContext);

  return (
    <div>
      {loading ? (
        <div className={styles.loading}>Carregando...</div>
      ) : (
        <div className={styles.homeContainer}>
          <div className={styles.navbar}>
            <Navbar />
          </div>

          <div className={styles.main}>
            <Main />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
