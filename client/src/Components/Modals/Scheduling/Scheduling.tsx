/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { FaChevronRight } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import axios from "axios";
import { Services } from "../../../types/Services";
import SeeHours from "../Hours/SeeHours/SeeHours";
import { DateContext } from "../../../context/DateContext";
import { AuthContext } from "../../../context/AuthContext";
import { Scheduled } from "../../../types/Scheduled";
import MdConfirmation from "../MdConfirmation/MdConfirmation";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface SchedulingProps {
  onClose: () => void;
}

const Scheduling: React.FC<SchedulingProps> = ({ onClose }) => {
  const [servicesVisible, setServicesVisible] = useState(false);
  const [services, setServices] = useState<Services[]>([]);
  const [barbers, setBarbers] = useState([{ nome: "" }]);
  const [seeHours, setSeeHours] = useState(false);
  const [scheduled, setScheduled] = useState<Scheduled>({} as Scheduled);
  const [mdConfirmation, setMdConfirmation] = useState(false);
  const { date } = useContext(DateContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const getServices = async () => {
    const response = await axios.get("http://localhost:3001/services");
    setServices(response.data);
  };

  const getBarbers = async () => {
    const response = await axios.get("http://localhost:3001/users/barbeiros");
    setBarbers(response.data);
  };

  const handleSchedule = async () => {
    const response = await axios.post("http://localhost:3001/schedule", {
      user,
      scheduled,
    });

    if (response.data.error) return toast(response.data.error);
    navigate(0);
  };

  useEffect(() => {
    getServices();
    setScheduled({ ...scheduled, data: date });
    getBarbers();
  }, [date]);

  useEffect(() => {
    console.log(scheduled);
  }, [scheduled.barbeiro, scheduled.data, scheduled.servicos]);

  return (
    <div>
      {seeHours ? (
        <SeeHours onClose={() => setSeeHours(false)} />
      ) : mdConfirmation ? (
        <MdConfirmation
          message="Agendar serviço?"
          onCancel={() => setMdConfirmation(false)}
          onClose={() => setMdConfirmation(false)}
          onConfirm={() => {
            handleSchedule();
            setMdConfirmation(false);
            onClose();
          }}
        />
      ) : (
        <div className={styles.modal}>
          <ToastContainer />
          <div className={styles.mdContainer}>
            <div className={styles.barber}>
              <span>BARBEIRO</span>
              <select
                name=""
                id=""
                onChange={(e) =>
                  setScheduled({ ...scheduled, barbeiro: e.target.value })
                }
                value={scheduled.barbeiro}
              >
                <option value="barbeiro">Barbeira(o)</option>
                {barbers.map((barber, i) => (
                  <option key={i} value={barber.nome}>
                    {barber.nome}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.service}>
              <span>
                SERVIÇOS{" "}
                <FaChevronRight
                  className={styles.arrow}
                  style={
                    servicesVisible
                      ? { transform: "rotate(90deg)" }
                      : { transform: "rotate(0deg)" }
                  }
                  onClick={() => {
                    if (servicesVisible) {
                      setServicesVisible(false);
                    } else {
                      setServicesVisible(true);
                    }
                  }}
                />
              </span>
              <div
                className={
                  servicesVisible ? styles.servicesActive : styles.services
                }
              >
                {services.map((service, i) => (
                  <span
                    onClick={() => {
                      if (
                        scheduled.servicos?.find((s) => s.nome === service.nome)
                      ) {
                        setScheduled({
                          ...scheduled,
                          servicos: scheduled.servicos.filter(
                            (s) => s.nome !== service.nome
                          ),
                        });
                        return;
                      }
                      setScheduled({
                        ...scheduled,
                        servicos: scheduled.servicos
                          ? [...scheduled.servicos, service]
                          : [service],
                      });
                    }}
                    key={i}
                    style={
                      scheduled.servicos?.find((s) => s.nome === service.nome)
                        ? {
                            background: "#000",
                            transform: "scale(.95)",
                            transition: ".25s",
                            color: "#fff",
                          }
                        : {
                            background: "#fff",
                            transition: ".25s",
                          }
                    }
                  >
                    <div className={styles.service}>{service.nome}</div>{" "}
                    <div className={styles.servicePrice}>{service.preco}</div>
                  </span>
                ))}
              </div>
            </div>
            <div className={styles.date}>
              <span>DATA</span>

              {date ? (
                <div className={styles.data}>
                  {`${date.dia > 10 ? date.dia : `0${date.dia}`}/${
                    date.mes > 10 ? date.mes : `0${date.mes}`
                  }   ${date.hora}`}
                  <button
                    className={styles.dateBtn}
                    onClick={() => setSeeHours(true)}
                  >
                    Editar
                  </button>
                </div>
              ) : (
                <button
                  className={styles.dateBtn}
                  onClick={() => setSeeHours(true)}
                >
                  Ver horários
                </button>
              )}
            </div>

            <IoIosClose className={styles.closeBtn} onClick={() => onClose()} />
            {scheduled.servicos?.length > 0 ? (
              <span>
                Total: {""}
                {scheduled.servicos
                  .reduce((acc, current) => acc + Number(current.preco), 0)
                  .toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
              </span>
            ) : null}
            <button
              onClick={() => {
                if (
                  !scheduled.barbeiro ||
                  !scheduled.servicos ||
                  scheduled.servicos.length === 0 ||
                  !scheduled.data
                ) {
                  return toast.error("Por favor, preencha todos os campos");
                } else {
                  setMdConfirmation(true);
                }
              }}
            >
              Agendar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scheduling;
