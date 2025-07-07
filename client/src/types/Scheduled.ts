import { Hours } from "./Hours";
import { Services } from "./Services";

export type Scheduled = {
  barbeiro: string;
  servicos: Services[];
  data: Hours | null;
  preco: number;
};
