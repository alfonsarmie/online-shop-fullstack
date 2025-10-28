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
      <div className={`step ${isDetailsActive ? 'active' : ''}`}>Información</div>

      <div className={`progress-line ${isPaymentActive ? 'line-filled' : ''}`}></div>

      <div className={`step ${isPaymentActive ? 'active' : ''}`}>Pago</div>
    </div>
  );
}

export default ProgressBar;