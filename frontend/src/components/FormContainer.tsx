import { ReactNode, FormEvent } from 'react';

// Props interface for FormContainer component
interface FormContainerProps {
  logo: string;
  title: string;
  children: ReactNode;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

function FormContainer({ logo, title, children, onSubmit }: FormContainerProps) {
    return (
        <form className="container" onSubmit={onSubmit}>
            <img src={logo} alt="Logo del sitio" />
            <h1>{title}</h1>
            {children} {/* Render form inputs and buttons here */}
        </form>
    );
}

export default FormContainer;