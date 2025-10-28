import '../styles/successMessage.css';

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
        <button className='close-btn-success' onClick={onClose}>×</button>
      )}
    </div>
  );
}

export default SuccessMessage;