function FormContainer({ logo, title, children, onSubmit }) {
    return (
        <form className="container" onSubmit={onSubmit}>
            <img src={logo} alt="Logo del sitio" />
            <h1>{title}</h1>
            {children} {/* Render form inputs and buttons here */}
        </form>
    );
}

export default FormContainer;