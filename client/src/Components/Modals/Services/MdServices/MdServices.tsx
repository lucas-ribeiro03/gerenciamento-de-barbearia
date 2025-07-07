import { useState } from "react";
import AddService from "../AddService/AddService";
import SeeServices from "../SeeServices/SeeServices";
import MdOptions from "../../MdOptions/MdOptions";

interface MdServicesProps {
  onClose: () => void;
}

const MdServices: React.FC<MdServicesProps> = ({ onClose }) => {
  const [formVisibility, setFormVisibility] = useState(false);
  const [seeServicesVisibility, setSeeServicesVisibility] = useState(false);
  if (formVisibility) {
    return <AddService onClose={() => setFormVisibility(false)} />;
  } else if (seeServicesVisibility) {
    return <SeeServices onClose={() => setSeeServicesVisibility(false)} />;
  }
  {
    return (
      <MdOptions
        button1="Adicionar"
        button2="Ver todos"
        function1={() => setFormVisibility(true)}
        function2={() => setSeeServicesVisibility(true)}
        onClose={() => onClose()}
      />
    );
  }
};

export default MdServices;
