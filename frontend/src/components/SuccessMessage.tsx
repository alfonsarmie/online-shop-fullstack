import '../styles/successMessage.css';

// Component to display success messages
interface SuccessMessageProps {
  message: string;
  onClose?: () => void;
}

function SuccessMessage({ message, onClose }: SuccessMessageProps) {
  if (!message) return null;
  
  return (
    <div className='success-message'>
      {message}
      {onClose && (
        <button className='close-btn' onClick={onClose}>×</button>
      )}
    </div>
  );
}

export default SuccessMessage;