export default function FormContainer({ logo, title, children, onSubmit }) {
    return (
        <form className="container" onSubmit={onSubmit}>
            <img src={logo} alt="Logo del sitio" />
            <h1>{title}</h1>
            {children}
        </form>
    );
}
