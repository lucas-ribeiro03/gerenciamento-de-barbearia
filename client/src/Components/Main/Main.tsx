/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import styles from "./style.module.scss";

import { AuthContext } from "../../context/AuthContext";
import ServiceCard from "../Cards/ServiceCard/ServiceCard";
import AllServicesCards from "../Cards/AllServicesCards/AllServicesCards";
import { FaScissors } from "react-icons/fa6";
import { ScheduledContext } from "../../context/ScheduledContext";
import Scheduling from "../Modals/Scheduling/Scheduling";
import DailyStats from "../Cards/Stats/DailyStats/DailyStats";
import WeekStats from "../Cards/Stats/WeekStats/WeekStats";
import MonthStats from "../Cards/Stats/MonthStats/MonthStats";

const Main = () => {
  const { loading, user } = useContext(AuthContext);
  const { scheduled, getScheduled, setScheduled } =
    useContext(ScheduledContext);

  const [mdScheduleVisible, setMdScheduleVisible] = useState(false);

  useEffect(() => {
    setScheduled(null);
    getScheduled();
  }, [user?.nome]);

  return (
    <div>
      {loading ? (
        <div className={styles.loading}>Carregando...</div>
      ) : (
        <div className={styles.main}>
          {user?.user_role === "admin" ? (
            <div className={styles.mainCards}>
              <div style={{ gridArea: "box1" }}>
                <AllServicesCards />
              </div>
              <div style={{ gridArea: "box2" }}>
                {" "}
                <DailyStats />
              </div>
              <div style={{ gridArea: "box3" }}>
                <WeekStats />
              </div>
              <div style={{ gridArea: "box4" }}>
                <MonthStats />
              </div>
            </div>
          ) : (
            <ServiceCard />
          )}

          {user?.user_role === "admin" ? null : (
            <span
              className={styles.scissor}
              onClick={() => (scheduled ? null : setMdScheduleVisible(true))}
            >
              <FaScissors />
            </span>
          )}

          <div className={styles.mdSchedule}>
            {mdScheduleVisible ? (
              <Scheduling onClose={() => setMdScheduleVisible(false)} />
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default Main;
