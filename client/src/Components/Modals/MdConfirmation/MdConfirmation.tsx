import styles from "./styles.module.scss";

import { IoIosClose } from "react-icons/io";

interface MdConfirmationProps {
  message: string;
  onClose: () => void;
  onConfirm: () => void;
  onCancel: () => void;
}
const MdConfirmation: React.FC<MdConfirmationProps> = ({
  message,
  onClose,
  onCancel,
  onConfirm,
}) => {
  return (
    <div>
      <div className={styles.modal}>
        <div className={styles.mdContainer}>
          <div className={styles.message}>{message}</div>
          <button onClick={onConfirm}>Sim</button>
          <button onClick={onCancel}>Não</button>
          <IoIosClose className={styles.closeBtn} onClick={onClose} />
        </div>
      </div>
    </div>
  );
};

export default MdConfirmation;
