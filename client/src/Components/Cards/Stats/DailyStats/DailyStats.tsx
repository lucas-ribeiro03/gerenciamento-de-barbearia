/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import styles from "./style.module.scss";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface Stats {
  ganhosDoDia: number;
  maisPedido: string;
  pedidosDoDia: number;
}

const cards: {
  title: string;
  key: keyof Stats;
  format: (value: Stats[keyof Stats]) => string;
}[] = [
  {
    title: "Ganhos",
    key: "ganhosDoDia",
    format: (v) => `R$ ${(v as number).toFixed(2)}`,
  },
  {
    title: "Mais pedido",
    key: "maisPedido",
    format: (v) => String(v),
  },
  {
    title: "Total de pedidos",
    key: "pedidosDoDia",
    format: (v) => `${v} pedidos`,
  },
];

const DailyStats = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [index, setIndex] = useState(1);

  const getStats = async () => {
    const response = await axios.get("http://localhost:3001/stats/dayStats");
    setStats(response.data);
    console.log(response);
  };

  useEffect(() => {
    getStats();
  }, []);

  const nextCard = () => {
    setIndex((prev) => (prev + 1) % cards.length);
  };

  const prevCard = () => {
    setIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % cards.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.bodyStat}>
      {!stats ? null : (
        <div>
          <h3>Stats do dia</h3>
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
      )}
    </div>
  );
};

export default DailyStats;
