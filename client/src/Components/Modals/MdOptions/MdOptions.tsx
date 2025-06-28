import { IoIosClose } from "react-icons/io";
import styles from "./style.module.scss";

interface MdOptionsProps {
  button1: string;
  button2: string;
  function1: () => void;
  function2: () => void;
  onClose: () => void;
}

const MdOptions: React.FC<MdOptionsProps> = ({
  button1,
  button2,
  onClose,
  function1,
  function2,
}) => {
  return (
    <div className={styles.modal}>
      <div className={styles.mdContainer}>
        <button onClick={() => function1()}>{button1}</button>
        <button onClick={() => function2()}>{button2}</button>
        <IoIosClose onClick={() => onClose()} />
      </div>
    </div>
  );
};

export default MdOptions;
