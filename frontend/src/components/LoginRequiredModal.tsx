import React from 'react';
import '../styles/login-modal.css';

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
}

export default function LoginRequiredModal({ isOpen, onClose, onLoginClick }: LoginRequiredModalProps) {
  if (!isOpen) return null;

  return (
    <div className="lr-modal-overlay" onClick={onClose}>
      <div className="lr-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="lr-modal-header">
          <h2>Inicia sesión para continuar</h2>
          <button className="lr-close" onClick={onClose} aria-label="Cerrar">×</button>
        </div>
        <div className="lr-modal-body">
          <p>Para completar tu compra necesitas iniciar sesión.</p>
        </div>
        <div className="lr-modal-footer">
          <button className="lr-btn secondary" onClick={onClose}>Cancelar</button>
          <button className="lr-btn primary" onClick={onLoginClick}>Iniciar sesión</button>
        </div>
      </div>
    </div>
  );
}

