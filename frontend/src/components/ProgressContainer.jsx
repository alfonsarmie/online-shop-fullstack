import '../styles/progressContainer.css';

// Progress indicator component for multi-step processes like checkout

function ProgressContainer() {
    return (
        <div className="progress-container">
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