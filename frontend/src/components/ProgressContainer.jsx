import '../styles/progressContainer.css';

function ProgressContainer() {
    return (
        <div className="progress-container">
            <div className="step active">Your details</div>
            <div className="progress-line"></div>
            <div className="step">Payment</div>
        </div>
    );
}

export default ProgressContainer;