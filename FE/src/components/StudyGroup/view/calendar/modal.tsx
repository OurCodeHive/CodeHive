import React, { useState } from 'react';
import style from './viewSchedule.module.css';

const ViewSchedule: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className={style.App}>
      <button id="openModalButton" onClick={toggleModal}>
        {isModalOpen ? 'Close Modal' : 'Open Modal'}
      </button>
      {isModalOpen && (
        <div className={style.modal}>
          <div className={style.modal_content}>
            <span className="close" onClick={toggleModal}>
              &times;
            </span>
            <p>This is a modal!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewSchedule;
