/* eslint-disable react-hooks/exhaustive-deps */
import styles from "./style.module.scss";

import { useContext, useEffect, useState } from "react";
import { ScheduledContext } from "../../../context/ScheduledContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MdConfirmation from "../../Modals/MdConfirmation/MdConfirmation";

interface MdConfirmationProp {
  visible: boolean;
  id: number;
}

const AllServicesCards = () => {
  const [mdConfirmationFinish, setMdConfirmationFinish] =
    useState<MdConfirmationProp>({ id: 0, visible: false });
  const [mdConfirmationCancel, setMdConfirmationCancel] =
    useState<MdConfirmationProp>({ id: 0, visible: false });

  const { handleGetAllSchedules, allSchedules } = useContext(ScheduledContext);
  useEffect(() => {
    handleGetAllSchedules();
  }, []);

  const navigate = useNavigate();

  const markAsFinished = async (id: number) => {
    await axios.put(
      "http://localhost:3001/schedule/admin",
      { action: "finalizar", id },
      { headers: { accessToken: localStorage.getItem("token") } }
    );
  };

  const markAsCanceled = async (id: number) => {
    await axios.put(
      "http://localhost:3001/schedule/admin",
      { action: "cancelar", id },
      { headers: { accessToken: localStorage.getItem("token") } }
    );
  };

  if (allSchedules) {
    return (
      <div className={styles.mainWrapper}>
        {mdConfirmationCancel.visible ? (
          <MdConfirmation
            message="Deseja mesmo cancelar?"
            onCancel={() => setMdConfirmationCancel({ id: 0, visible: false })}
            onClose={() => setMdConfirmationCancel({ id: 0, visible: false })}
            onConfirm={() => {
              markAsCanceled(mdConfirmationCancel.id);
              setMdConfirmationCancel({ id: 0, visible: false });
              navigate(0);
            }}
          />
        ) : mdConfirmationFinish.visible ? (
          <MdConfirmation
            message="Deseja mesmo finalizar?"
            onCancel={() => setMdConfirmationFinish({ id: 0, visible: false })}
            onClose={() => setMdConfirmationFinish({ id: 0, visible: false })}
            onConfirm={() => {
              markAsFinished(mdConfirmationFinish.id);
              setMdConfirmationFinish({ id: 0, visible: false });
              navigate(0);
            }}
          />
        ) : (
          <div className={styles.carouselWrapper}>
            <div className={styles.carouselContent}>
              {allSchedules &&
                allSchedules
                  .sort(
                    (a, b) =>
                      Number(a.pedido.hora.slice(3, 5)) -
                      Number(b.pedido.hora.slice(3, 5))
                  )
                  .sort(
                    (a, b) =>
                      Number(a.pedido.hora.slice(0, 2)) -
                      Number(b.pedido.hora.slice(0, 2))
                  )
                  .sort(
                    (a, b) =>
                      Number(a.pedido.data.slice(3, 5)) -
                      Number(b.pedido.data.slice(3, 5))
                  )
                  .sort(
                    (a, b) =>
                      Number(a.pedido.data.slice(0, 2)) -
                      Number(b.pedido.data.slice(0, 2))
                  )

                  .map((schedule, i) => (
                    <div className={styles.card} key={i}>
                      <div
                        className={styles.cliente}
                        style={{ gridArea: "box1" }}
                      >
                        Cliente: {schedule.usuario.nome}
                      </div>
                      <div className={styles.data} style={{ gridArea: "box2" }}>
                        Data: {schedule.pedido.data}
                      </div>
                      <div className={styles.hora} style={{ gridArea: "box3" }}>
                        Hora: {schedule.pedido.hora}
                      </div>
                      <div
                        className={styles.barbeiro}
                        style={{ gridArea: "box4" }}
                      >
                        Barbeira(o): {schedule.pedido.barbeiro}
                      </div>

                      <div
                        className={styles.servicos}
                        style={{ gridArea: "box5" }}
                      >
                        Serviços:
                        {schedule.servico.map((s, i) => (
                          <div className={styles.servico} key={i}>
                            {s.nome}
                          </div>
                        ))}
                      </div>

                      <div
                        className={styles.valor}
                        style={{ gridArea: "box6" }}
                      >
                        Valor: {""}
                        {schedule.servico
                          .reduce(
                            (acc: number, current) =>
                              acc + Number(current.preco),
                            0
                          )
                          .toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                      </div>
                      <button
                        className={styles.finalizar}
                        onClick={() =>
                          setMdConfirmationFinish({
                            id: schedule.pedido.id,
                            visible: true,
                          })
                        }
                        style={{ gridArea: "box7" }}
                      >
                        Finalizar
                      </button>

                      <button
                        className={styles.cancelar}
                        onClick={() =>
                          setMdConfirmationCancel({
                            id: schedule.pedido.id,
                            visible: true,
                          })
                        }
                        style={{ gridArea: "box8" }}
                      >
                        Cancelar
                      </button>
                    </div>
                  ))}
            </div>
          </div>
        )}
      </div>
    );
  }
};

export default AllServicesCards;
