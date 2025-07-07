import styles from "./style.module.scss";

import { FaCalendarAlt, FaClock } from "react-icons/fa";
import { BsPersonFill, BsTelephoneFill } from "react-icons/bs";
import { RiVipCrown2Fill } from "react-icons/ri";
import { IoMdSettings } from "react-icons/io";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { IoIosExit } from "react-icons/io";
import { FaScissors } from "react-icons/fa6";
import MdServices from "../Modals/Services/MdServices/MdServices";
import MdHours from "../Modals/Hours/MdHours/MdHours";
import Scheduling from "../Modals/Scheduling/Scheduling";
import { ScheduledContext } from "../../context/ScheduledContext";
import Profile from "../Modals/Profile/Profile";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [mdServicesVisible, setMdServicesVisible] = useState(false);
  const [mdHoursVisible, setMdHoursVisible] = useState(false);
  const [mdScheduleVisible, setMdScheduleVisible] = useState(false);
  const [mdProfileVisible, setMdProfileVisible] = useState(false);
  const { scheduled } = useContext(ScheduledContext);

  if (user) {
    if (user.user_role === "cliente") {
      return (
        <div className={styles.navContainer}>
          <nav>
            <div className={styles.userInfo}>
              <span>
                <div className={styles.userName}> {user.nome}</div>
                <div className={styles.userRole}>{user.user_role}</div>
              </span>
            </div>
            <ul>
              <li
                onClick={() => (scheduled ? null : setMdScheduleVisible(true))}
              >
                <a>
                  Agendar <FaCalendarAlt />
                </a>
              </li>
              <li onClick={() => setMdProfileVisible(true)}>
                <a>
                  Perfil <BsPersonFill />
                </a>
              </li>
              <li>
                <a>
                  Planos <RiVipCrown2Fill />
                </a>
              </li>
              <li>
                <a>
                  Histórico <FaClock />
                </a>
              </li>
              <li>
                <a>
                  Configurações <IoMdSettings />
                </a>
              </li>
              <li>
                <a>
                  Contato <BsTelephoneFill />
                </a>
              </li>
            </ul>
            <div className={styles.navFooter}>
              <button onClick={() => logout()}>
                <IoIosExit /> Sair
              </button>
            </div>
          </nav>
          <div className={styles.mdSchedule}>
            {mdScheduleVisible ? (
              <Scheduling onClose={() => setMdScheduleVisible(false)} />
            ) : null}
          </div>
        </div>
      );
    } else if (user.user_role === "admin") {
      return (
        <div className={styles.navContainer}>
          <nav>
            <div className={styles.userInfo}>
              <span>
                <div className={styles.userName}> {user.nome}</div>
                <div className={styles.userRole}>{user.user_role}</div>
              </span>
            </div>
            <ul>
              <li onClick={() => setMdHoursVisible(true)}>
                <a>
                  Horários <FaCalendarAlt />
                </a>
              </li>
              <li onClick={() => setMdServicesVisible(true)}>
                <a>
                  Serviços <FaScissors />
                </a>
              </li>
              <li onClick={() => setMdProfileVisible(true)}>
                <a>
                  Perfil <BsPersonFill />
                </a>
              </li>
              <li>
                <a>
                  Planos <RiVipCrown2Fill />
                </a>
              </li>
              <li>
                <a>
                  Histórico <FaClock />
                </a>
              </li>
              <li>
                <a>
                  Configurações <IoMdSettings />
                </a>
              </li>
            </ul>
            <div className={styles.navFooter}>
              <button onClick={() => logout()}>
                <IoIosExit /> Sair
              </button>
            </div>
          </nav>

          <div className={styles.mdServices}>
            {mdServicesVisible ? (
              <MdServices onClose={() => setMdServicesVisible(false)} />
            ) : null}
          </div>

          <div className={styles.mdHours}>
            {mdHoursVisible ? (
              <MdHours onClose={() => setMdHoursVisible(false)} />
            ) : null}
          </div>

          <div className={styles.mdProfile}>
            {mdProfileVisible ? (
              <Profile onClose={() => setMdProfileVisible(false)} />
            ) : null}
          </div>
        </div>
      );
    }
  }
};

export default Navbar;
