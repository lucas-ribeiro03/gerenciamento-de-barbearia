/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { IoIosClose } from "react-icons/io";
import axios from "axios";
import { DateContext } from "../../../../context/DateContext";

import { Hours } from "../../../../types/Hours";

interface SeeHoursProps {
  onClose: () => void;
}

const SeeHours: React.FC<SeeHoursProps> = ({ onClose }) => {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const [day, setDay] = useState(new Date().getDate());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [selected, setSelected] = useState([] as Hours[]);

  const { setDate } = useContext(DateContext);

  const handleNextDay = () => {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();

    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

    if (day < totalDaysInMonth) {
      setDay(day + 1);
    }
  };

  const getHours = async () => {
    const response = await axios.get("http://localhost:3001/hours");
    setSelected([...selected, ...response.data]);
  };

  const markAsSelected = (dia: number, mes: number, hora: string) => {
    if (selected.find((s) => s.isSelected === true)) {
      setSelected(
        selected.map((s) =>
          s.dia === dia && s.mes === mes && s.hora === hora
            ? { ...s, isSelected: true }
            : { ...s, isSelected: false }
        )
      );
    } else {
      setSelected(
        selected.map((s) =>
          s.dia === dia && s.mes === mes && s.hora === hora
            ? { ...s, isSelected: true }
            : s
        )
      );
    }

    setDate({
      dia,
      mes,
      hora,
      isSelected: true,
    });
  };

  useEffect(() => {
    getHours();
    console.log(month, day);
  }, []);

  return (
    <div>
      <div className={styles.modal}>
        <div className={styles.mdContainer}>
          <div className={styles.dayWrapper} style={{ gridArea: "box1" }}>
            <button
              onClick={() => {
                if (currentMonth === month && day === now.getDate()) {
                  return;
                }

                if (day === 1) return;

                setDay(day - 1);
              }}
            >
              <FaChevronLeft />
            </button>
            <div className={styles.day}>{day}</div>
            <button onClick={() => handleNextDay()}>
              <FaChevronRight />
            </button>
          </div>
          <select
            onChange={(e) => {
              setMonth(Number(e.target.value));
              setDay(now.getDate());
            }}
            value={month}
            name="months"
            id="months"
            className={styles.select}
            style={{ gridArea: "box2" }}
          >
            {Array.from({ length: 13 - (now.getMonth() + 1) }, (_, i) => (
              <option value={now.getMonth() + 1 + i} key={i}>
                {now.getMonth() + 1 + i}
              </option>
            ))}
          </select>

          <div className={styles.hours}>
            {selected
              .filter((s) => s.dia === day && s.mes === month)
              .sort(
                (a, b) =>
                  Number(a.hora.slice(3, 4)) - Number(b.hora.slice(3, 4))
              )
              .sort(
                (a, b) =>
                  Number(a.hora.slice(0, 2)) - Number(b.hora.slice(0, 2))
              )

              .map((h, i) => (
                <div
                  style={
                    h.isSelected
                      ? {
                          background: "black",
                          color: "#fff",
                          transition: ".25s",
                        }
                      : { background: "" }
                  }
                  onClick={() => {
                    markAsSelected(day, month, h.hora);
                  }}
                  className={
                    h.dia === now.getDate() &&
                    h.mes === now.getMonth() + 1 &&
                    Number(parseInt(h.hora.slice(0, 2))) <= now.getHours()
                      ? styles.horaInvalida
                      : styles.hora
                  }
                  key={i}
                >
                  {h.hora}
                </div>
              ))}
          </div>
          <IoIosClose onClick={() => onClose()} />
        </div>
      </div>
    </div>
  );
};

export default SeeHours;
