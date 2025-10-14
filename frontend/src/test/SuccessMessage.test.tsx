import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SuccessMessage from '../components/SuccessMessage';

describe('SuccessMessage Component', () => {
  it('should render success message when message prop is provided', () => {
    const testMessage = 'Operación completada exitosamente';
    
    render(<SuccessMessage message={testMessage} />);
    
    expect(screen.getByText(testMessage)).toBeInTheDocument();
  });
});