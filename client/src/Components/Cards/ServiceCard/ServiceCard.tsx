import styles from "./style.module.scss";
import { useContext, useEffect, useState } from "react";
import MdConfirmation from "../../Modals/MdConfirmation/MdConfirmation";
import { ScheduledContext } from "../../../context/ScheduledContext";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ServiceCard = () => {
  const [mdConfirmation, setMdConfirmation] = useState(false);

  const { user } = useContext(AuthContext);

  const { scheduled, getScheduled, handleDeleteSchedule } =
    useContext(ScheduledContext);

  const navigate = useNavigate();

  useEffect(() => {
    getScheduled();
  }, [user?.nome]);
  return (
    <div>
      {mdConfirmation ? (
        <MdConfirmation
          message="Deseja mesmo cancelar?"
          onCancel={() => setMdConfirmation(false)}
          onClose={() => setMdConfirmation(false)}
          onConfirm={() => {
            handleDeleteSchedule();
            setMdConfirmation(false);
            navigate(0);
          }}
        />
      ) : scheduled ? (
        <div className={styles.card}>
          <div className={styles.data} style={{ gridArea: "box1" }}>
            Data: {`${scheduled.data?.dia}/${scheduled.data?.mes}`}
          </div>
          <div className={styles.hora} style={{ gridArea: "box2" }}>
            Hora: {scheduled.data?.hora}
          </div>
          <div className={styles.barbeiro} style={{ gridArea: "box3" }}>
            Barbeira(o): {scheduled.barbeiro}
          </div>
          <div className={styles.servicos} style={{ gridArea: "box4" }}>
            Serviços:
            {scheduled.servicos &&
              scheduled.servicos.map((s, i) => (
                <div key={i} className={styles.servico}>
                  {String(s)}
                </div>
              ))}
          </div>
          <div className={styles.valor} style={{ gridArea: "box5" }}>
            Valor:{" "}
            {scheduled.preco &&
              scheduled.preco.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
          </div>
          <button
            style={{ gridArea: "box6", marginTop: "1rem" }}
            onClick={() => setMdConfirmation(true)}
          >
            Cancelar
          </button>
        </div>
      ) : (
        <h1>Sem serviços agendados</h1>
      )}
    </div>
  );
};
export default ServiceCard;
