/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import styles from "./style.module.scss";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface Stats {
  ganhosSemana: number;
  maisPedido: string;
  pedidosDaSemana: number;
}

const cards: {
  title: string;
  key: keyof Stats;
  format: (value: Stats[keyof Stats]) => string;
}[] = [
  {
    title: "Ganhos",
    key: "ganhosSemana",
    format: (v) => `R$ ${(v as number).toFixed(2)}`,
  },
  {
    title: "Mais pedido",
    key: "maisPedido",
    format: (v) => String(v),
  },
  {
    title: "Total de pedidos",
    key: "pedidosDaSemana",
    format: (v) => `${v} pedidos`,
  },
];

const WeekStats = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [index, setIndex] = useState(2);

  const getStats = async () => {
    const response = await axios.get("http://localhost:3001/stats/weekStats");
    setStats(response.data);
  };

  useEffect(() => {
    getStats();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % cards.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextCard = () => {
    setIndex((prev) => (prev + 1) % cards.length);
  };

  const prevCard = () => {
    setIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  return (
    <div className={styles.bodyStat}>
      <h3>Stats da semana</h3>
      <div className={styles.wrapper}>
        <FaChevronLeft onClick={prevCard} className={styles.arrow} />

        <div className={styles.cardContainer}>
          {stats && (
            <div className={styles.statsContainer}>
              <div>
                <h5>{cards[index].title}</h5>
                <span>
                  {cards[index].format(
                    stats[cards[index].key as keyof Stats] as any
                  )}
                </span>
              </div>
            </div>
          )}
        </div>
        <FaChevronRight onClick={nextCard} className={styles.arrow} />
      </div>
    </div>
  );
};

export default WeekStats;
