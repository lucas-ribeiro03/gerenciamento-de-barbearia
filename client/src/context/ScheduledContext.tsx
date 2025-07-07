/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";
import { Scheduled } from "../types/Scheduled";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface ScheduledContextData {
  scheduled: Scheduled | null;
  allSchedules: ResponseAllSchedules[] | null;
  setScheduled: React.Dispatch<React.SetStateAction<Scheduled | null>>;
  handleDeleteSchedule: () => Promise<void>;
  handleGetAllSchedules: () => Promise<void>;
  getScheduled: () => Promise<void>;
}

export const ScheduledContext = createContext({} as ScheduledContextData);

interface ScheduledProviderProps {
  children: React.ReactNode;
}

interface ResponseSchedule {
  servico: {
    nome: string;
    preco: number;
  };
}

interface ResponseAllSchedules {
  pedido_id: number;
  pedido: {
    id: number;
    data: string;
    hora: string;
    barbeiro: string;
  };

  servico: [
    {
      nome: string;
      preco: number;
    }
  ];

  usuario: {
    nome: string;
  };
}

export const ScheduledProvider: React.FC<ScheduledProviderProps> = ({
  children,
}) => {
  const [scheduled, setScheduled] = useState<Scheduled | null>(null);
  const [allSchedules, setAllSchedules] = useState<
    ResponseAllSchedules[] | null
  >(null);

  const navigate = useNavigate();

  const getScheduled = async () => {
    const responseOrder = await axios.get("http://localhost:3001/order/card", {
      headers: { accessToken: localStorage.getItem("token") },
    });
    const responseSchedule = await axios.get(
      "http://localhost:3001/schedule/card",
      {
        headers: { accessToken: localStorage.getItem("token") },
      }
    );

    if (!responseOrder.data || !responseSchedule.data) {
      return;
    }

    const scheduleDate = responseOrder.data.data.split("/");
    console.log(scheduleDate);

    const schedule = {
      barbeiro: responseOrder.data.barbeiro,
      data: {
        dia: scheduleDate[0],
        mes: scheduleDate[1],
        hora: responseOrder.data.hora,
        isSelected: true,
      },

      servicos: responseSchedule.data.map(
        (service: ResponseSchedule) => service.servico.nome
      ),

      preco: responseSchedule.data.reduce(
        (acc: number, current: ResponseSchedule) =>
          acc + Number(current.servico.preco),
        0
      ),
    };

    setScheduled(schedule);
    console.log(responseOrder.data.data);
  };

  const handleGetAllSchedules = async () => {
    const response = await axios.get("http://localhost:3001/schedule", {
      headers: { accessToken: localStorage.getItem("token") },
    });

    if (response.data.length < 1) {
      return setAllSchedules(null);
    }

    const agrupado: ResponseAllSchedules[] = [];
    response.data.forEach((item: any) => {
      const pedidoExistente = agrupado.find(
        (p: ResponseAllSchedules) => p.pedido.id === item.pedido_id
      );

      if (pedidoExistente) {
        pedidoExistente.servico.push({
          nome: item.servico.nome,
          preco: item.servico.preco,
        });
      } else {
        agrupado.push({
          pedido_id: item.pedido_id,
          pedido: {
            id: item.pedido_id,
            data: item.pedido.data,
            hora: item.pedido.hora,
            barbeiro: item.pedido.barbeiro,
          },
          servico: [
            {
              nome: item.servico.nome,
              preco: item.servico.preco,
            },
          ],

          usuario: {
            nome: item.usuario.nome,
          },
        });
      }
    });
    setAllSchedules(agrupado);
  };

  const handleDeleteSchedule = async () => {
    await axios.put(
      "http://localhost:3001/schedule",
      { action: "cancelar" },
      {
        headers: { accessToken: localStorage.getItem("token") },
      }
    );

    console.log("cacnelo");

    navigate(0);
  };

  return (
    <ScheduledContext.Provider
      value={{
        scheduled,
        setScheduled,
        handleDeleteSchedule,
        handleGetAllSchedules,
        getScheduled,
        allSchedules,
      }}
    >
      {children}
    </ScheduledContext.Provider>
  );
};
