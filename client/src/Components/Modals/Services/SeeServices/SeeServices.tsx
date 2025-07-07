import axios from "axios";
import styles from "./style.module.scss";
import { IoIosClose } from "react-icons/io";
import { FaTrash, FaPencilAlt } from "react-icons/fa";

import { useEffect, useState } from "react";
import { Services } from "../../../../types/Services";
import AddService from "../AddService/AddService";
import MdConfirmation from "../../MdConfirmation/MdConfirmation";

interface SeeServicesProps {
  onClose: () => void;
}

const SeeServices: React.FC<SeeServicesProps> = ({ onClose }) => {
  const [services, setServices] = useState<Services[]>([]);
  const [servicetoEdit, setServiceToEdit] = useState<Services>({} as Services);
  const [formVisibility, setFormVisibility] = useState(false);
  const [confirmationMd, setConfirmationMd] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(0);

  const getServices = async () => {
    const response = await axios.get("http://localhost:3001/services");
    setServices(response.data);
  };

  useEffect(() => {
    getServices();
  }, []);

  const handleDeleteService = async (id: number) => {
    await axios.delete(`http://localhost:3001/services/${id}`);
    setServices(services.filter((service) => service.id !== id));
  };

  return (
    <>
      {formVisibility && (
        <AddService
          onClose={() => {
            setFormVisibility(false);
            setServiceToEdit({} as Services);
            getServices();
          }}
          editingService={servicetoEdit}
        />
      )}
      {confirmationMd && (
        <MdConfirmation
          message="Apagar serviço?"
          onCancel={() => setConfirmationMd(false)}
          onConfirm={() => {
            handleDeleteService(serviceToDelete);
            setConfirmationMd(false);
          }}
          onClose={() => setConfirmationMd(false)}
        />
      )}

      {!formVisibility && !confirmationMd && (
        <div className={styles.modal}>
          <div className={styles.mdContainer}>
            <div className={styles.filterBox}>
              <input type="text" placeholder="Procurar" />
            </div>
            <div className={styles.servicesList}>
              {services.map((service, index) => {
                return (
                  <div className={styles.service} key={index}>
                    <span onClick={() => setServiceToEdit(service)}>
                      <FaPencilAlt onClick={() => setFormVisibility(true)} />
                      <FaTrash
                        onClick={() => {
                          setServiceToDelete(service.id);
                          setConfirmationMd(true);
                        }}
                      />
                      {service.nome}
                    </span>
                    <span>R$ {service.preco}</span>
                  </div>
                );
              })}
            </div>
            <IoIosClose onClick={() => onClose()} />
          </div>
        </div>
      )}
    </>
  );
};

export default SeeServices;
