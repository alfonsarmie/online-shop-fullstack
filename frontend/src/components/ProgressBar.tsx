import React from 'react';
import '../styles/progressbar.css';

interface ProgressContainerProps {
  currentStep: 'Información' | 'Pago';
  className?: string;
}

function ProgressBar({ currentStep, className }: ProgressContainerProps) {
  const isDetailsActive = currentStep === 'Información';
  const isPaymentActive = currentStep === 'Pago';

  return (
    <div className={`progress-container ${className || ''}`}>
      {/* "Información" step */}
      <div className={`step ${isDetailsActive ? 'active' : ''}`}>Información</div>

      {/* Visual progress line */}
      <div className={`progress-line ${isPaymentActive ? 'line-filled' : ''}`}></div>

      {/* "Pago" step */}
      <div className={`step ${isPaymentActive ? 'active' : ''}`}>Pago</div>
    </div>
  );
}

export default ProgressBar;