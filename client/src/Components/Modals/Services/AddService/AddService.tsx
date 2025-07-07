import axios from "axios";
import styles from "./style.module.scss";
import { IoIosClose } from "react-icons/io";
import { useEffect, useState } from "react";
import { Services } from "../../../../types/Services";

interface AddServiceProps {
  onClose: () => void;
  editingService?: Services | null;
}

const AddService: React.FC<AddServiceProps> = ({ onClose, editingService }) => {
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState<number | null>(null);
  const [categoria, setCategoria] = useState("");

  useEffect(() => {
    if (editingService) {
      console.log(editingService);
      setNome(editingService.nome);
      setPreco(editingService.preco);
      setCategoria(editingService.categoria);
    }
  }, [editingService]);

  const handleAddService = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editingService) {
      await axios
        .put("http://localhost:3001/services", {
          nome,
          preco,
          categoria,
          id: editingService.id,
        })
        .then(onClose);
    } else {
      await axios
        .post("http://localhost:3001/services", {
          nome,
          preco,
          categoria,
        })
        .then(() => {
          setCategoria("");
          setPreco(null);
          setNome("");
        })
        .catch((e) => console.log(e));
    }
  };

  return (
    <div className={styles.modal}>
      <form
        onSubmit={(e) => handleAddService(e)}
        className={styles.addServiceForm}
      >
        <div className={styles.inputBox}>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            type="text"
            id="nome"
            placeholder=" "
          />
          <label className={styles.label} htmlFor="nome">
            Nome do procedimento
          </label>
        </div>
        <div className={styles.inputBox}>
          <input
            type="text"
            placeholder=" "
            value={preco ?? ""}
            onChange={(e) => setPreco(Number(e.target.value))}
          />
          <label className={styles.label}>Preço </label>
        </div>
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          name=""
          id=""
        >
          <option value="" disabled>
            Categoria
          </option>
          <option value="barba">Barba</option>
          <option value="corte">Corte</option>
          <option value="Tratamentos">Tratamentos</option>
        </select>
        {editingService ? <button>Editar</button> : <button>Adicionar</button>}
        <IoIosClose onClick={() => onClose()} />
      </form>
    </div>
  );
};

export default AddService;
