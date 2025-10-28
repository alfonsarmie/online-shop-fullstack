import { ReactNode, FormEvent } from 'react';

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
            {children} 
        </form>
    );
}

export default FormContainer;