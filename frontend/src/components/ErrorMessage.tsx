import '../styles/errorMessage.css';

interface ErrorMessageProps {
  message: string;
  onClose?: () => void;
}

function ErrorMessage({ message, onClose }: ErrorMessageProps) {
  if (!message) return null;
  
  return (
    <div className='error-message'>
      {message}
      {onClose && (
        <button className='close-btn' onClick={onClose}>×</button>
      )}
    </div>
  );
}

export default ErrorMessage;