/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import styles from "./style.module.scss";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import axios from "axios";

interface Hours {
  dia: number;
  mes: number;
  hora: string;
}

interface AddHoursProps {
  onClose: () => void;
}

const AddHours: React.FC<AddHoursProps> = ({ onClose }) => {
  const [day, setDay] = useState(new Date().getDate());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [selectedHours, setSelectedHours] = useState<Hours[]>([] as Hours[]);

  const getSavedHours = async () => {
    const response = await axios.get("http://localhost:3001/hours");
    setSelectedHours([...selectedHours, ...response.data]);
  };

  const handleNextDay = () => {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();

    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

    if (day < totalDaysInMonth) {
      setDay(day + 1);
    }
  };

  const handleAddHours = async (hour: string) => {
    if (
      selectedHours.find(
        (s) => s.dia === day && s.mes === month && s.hora === hour
      )
    ) {
      setSelectedHours(
        selectedHours.filter(
          (s) => s.dia === day && s.mes === month && s.hora !== hour
        )
      );
      await axios
        .delete(`http://localhost:3001/hours/${day}/${month}/${hour}`)
        .then(() => console.log("deletado"));

      return;
    }
    setSelectedHours([
      ...selectedHours,
      {
        dia: day,
        mes: month,
        hora: hour,
      },
    ]);

    await axios.post("http://localhost:3001/hours", {
      dia: day,
      mes: month,
      hora: hour,
      isSelected: false,
    });
  };

  useEffect(() => {
    getSavedHours();
  }, []);

  return (
    <div>
      <div className={styles.modal}>
        <div className={styles.addHoursForm}>
          <div className={styles.dayWrapper} style={{ gridArea: "box1" }}>
            <button
              onClick={() => {
                if (day === new Date().getDate()) {
                  return;
                }

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
            onChange={(e) => setMonth(Number(e.target.value))}
            value={month}
            name="months"
            id="months"
            className={styles.select}
            style={{ gridArea: "box2" }}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option value={i + 1} key={i}>
                {i + 1}
              </option>
            ))}
          </select>

          <div className={styles.hours} style={{ gridArea: "box3" }}>
            {Array.from({ length: 24 }, (_, i) => {
              const hour = 8 + Math.floor(i / 2);
              const now = new Date();
              const minute = i % 2 ? "30" : "00";
              const brasilHour = new Date(
                now.getTime() - now.getTimezoneOffset() * 60000 * 60 * 60 * 1000
              ).getHours();
              const time = `${hour.toString().padStart(2, "0")}:${minute}`;

              return (
                <button
                  onClick={() => handleAddHours(time)}
                  className={
                    selectedHours.find(
                      (t) => t.dia === day && t.mes === month && t.hora === time
                    )
                      ? styles.addedTime
                      : now.getDate() === day &&
                        now.getMonth() + 1 === month &&
                        brasilHour >= hour
                      ? styles.unabled
                      : styles.time
                  }
                  key={time}
                  disabled={
                    now.getDate() === day &&
                    now.getMonth() + 1 === month &&
                    brasilHour >= hour
                  }
                >
                  {time}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => onClose()}
            className={styles.addButton}
            style={{ gridArea: "box4" }}
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddHours;
