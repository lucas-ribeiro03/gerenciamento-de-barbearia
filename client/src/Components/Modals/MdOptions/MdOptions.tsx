import { IoIosClose } from "react-icons/io";
import styles from "./style.module.scss";

interface MdOptionsProps {
  button1?: string;
  button2?: string;
  function1?: () => void;
  function2?: () => void;
  input?: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >;
  onClose: () => void;
}

const MdOptions: React.FC<MdOptionsProps> = ({
  button1,
  button2,
  onClose,
  function1,
  function2,
  input,
}) => {
  return (
    <div className={styles.modal}>
      <div className={styles.mdContainer}>
        {input && <input type="text" />}
        {button1 && (
          <button onClick={() => (function1 ? function1() : null)}>
            {button1}
          </button>
        )}
        {button2 && (
          <button onClick={() => (function2 ? function2() : null)}>
            {button2}
          </button>
        )}
        <IoIosClose onClick={() => onClose()} />
      </div>
    </div>
  );
};

export default MdOptions;
