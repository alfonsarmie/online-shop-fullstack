import '../styles/progressContainer.css';

// Props interface for ProgressContainer
interface ProgressContainerProps {
  className?: string;
}

// Progress indicator component for multi-step processes like checkout
function ProgressContainer({ className }: ProgressContainerProps) {
    return (
        <div className={`progress-container ${className || ''}`}>
            {/* Current active step */}
            <div className="step active">Your details</div>

            {/* Visual progress line connecting steps */}
            <div className="progress-line"></div>

            {/* Upcoming steps */}
            <div className="step">Payment</div>
        </div>
    );
}

export default ProgressContainer;