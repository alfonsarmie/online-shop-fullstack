import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from '../components/Input';

describe('Input Component', () => {
  const defaultProps = {
    type: 'text',
    placeholder: 'Ingrese su nombre',
    value: '',
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render input with correct attributes', () => {
    render(<Input {...defaultProps} />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('placeholder', 'Ingrese su nombre');
    expect(input).toHaveValue('');
  });

  it('should call onChange when user types', async () => {
    const mockOnChange = vi.fn();
    const user = userEvent.setup();
    
    render(<Input {...defaultProps} onChange={mockOnChange} />);
    
    const input = screen.getByRole('textbox');
    await user.type(input, 'Hello');
    
    expect(mockOnChange).toHaveBeenCalledTimes(5); // One for each character
  });
});