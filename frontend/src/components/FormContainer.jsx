export default function FormContainer({ logo, title, children }) {
    return (
        <form className="container">
            <img src={logo} alt="Logo del sitio" />
            <h1>{title}</h1>
            {children}
        </form>
    );
}
