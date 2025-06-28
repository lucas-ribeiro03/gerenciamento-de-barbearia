import React, { useState } from "react";
import MdOptions from "../../MdOptions/MdOptions";
import AddHours from "../AddHours/AddHours";
import SeeHours from "../SeeHours/SeeHours";

interface MdHoursProps {
  onClose: () => void;
}
const MdHours: React.FC<MdHoursProps> = ({ onClose }) => {
  const [addHours, setAddHours] = useState(false);
  const [seeHours, setSeeHours] = useState(false);

  if (addHours) {
    return <AddHours onClose={() => setAddHours(false)} />;
  } else if (seeHours) {
    return <SeeHours onClose={() => setSeeHours(false)} />;
  }
  return (
    <div>
      <MdOptions
        button1="Ver todos"
        button2="Adicionar"
        function1={() => setSeeHours(true)}
        function2={() => setAddHours(true)}
        onClose={onClose}
      />
    </div>
  );
};

export default MdHours;
