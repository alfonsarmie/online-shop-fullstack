import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import "../styles/admin-users.css";
import Input from "../components/Input";
import PasswordInput from "../components/PasswordInput";
import PasswordConfirm from "../components/PasswordConfirm";
import SuccessMessage from "../components/SuccessMessage";
import ErrorMessage from "../components/ErrorMessage";
import api from "../services/api";

type StaffRole = "admin" | "receptionist";

interface FormData {
  name: string;
  surname: string;
  email: string;
  dni: string;
  password: string;
  confirmPassword: string;
  role: StaffRole;
}

interface PasswordStrength {
  strength: number;
  label: string;
  color: string;
  width: string;
}

interface Requirement {
  text: string;
  valid: boolean;
}

interface LastCreatedUser {
  name: string;
  surname: string;
  email: string;
  role: StaffRole;
}

const ROLE_OPTIONS: { label: string; value: StaffRole }[] = [
  { label: "Administrador", value: "admin" },
  { label: "Recepcionista", value: "receptionist" },
];

const ROLE_LABEL: Record<StaffRole, string> = {
  admin: "Administrador",
  receptionist: "Recepcionista",
};

const initialForm: FormData = {
  name: "",
  surname: "",
  email: "",
  dni: "",
  password: "",
  confirmPassword: "",
  role: "receptionist",
};

const AdminUsers = () => {
  const [formData, setFormData] = useState<FormData>(initialForm);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    strength: 0,
    label: "",
    color: "#d0d0d0",
    width: "0%",
  });
  const [requirements, setRequirements] = useState<Requirement[]>([
    { text: "Al menos 6 caracteres", valid: false },
    { text: "Incluye una mayuscula", valid: false },
    { text: "Incluye un numero", valid: false },
  ]);
  const [matchMessage, setMatchMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [lastCreatedUser, setLastCreatedUser] = useState<LastCreatedUser | null>(null);

  useEffect(() => {
    const { password, confirmPassword } = formData;

    const updatedRequirements: Requirement[] = [
      { text: "Al menos 6 caracteres", valid: password.length >= 6 },
      { text: "Incluye una mayuscula", valid: /[A-Z]/.test(password) },
      { text: "Incluye un numero", valid: /[0-9]/.test(password) },
    ];
    setRequirements(updatedRequirements);

    const completed = updatedRequirements.filter((req) => req.valid).length;
    const strengthLevels: PasswordStrength[] = [
      { strength: 0, width: "0%", label: "", color: "#d0d0d0" },
      { strength: 1, width: "33%", label: "Debil", color: "#d9534f" },
      { strength: 2, width: "66%", label: "Media", color: "#f0ad4e" },
      { strength: 3, width: "100%", label: "Fuerte", color: "#5cb85c" },
    ];
    setPasswordStrength(strengthLevels[completed]);

    if (!confirmPassword) {
      setMatchMessage("");
    } else if (password === confirmPassword) {
      setMatchMessage("Las contrasenas coinciden");
    } else {
      setMatchMessage("Las contrasenas no coinciden");
    }
  }, [formData.password, formData.confirmPassword]);

  const isFormValid = useMemo(() => {
    return (
      Boolean(formData.name.trim() && formData.surname.trim() && formData.email.trim()) &&
      requirements.every((req) => req.valid) &&
      formData.password === formData.confirmPassword
    );
  }, [formData.name, formData.surname, formData.email, formData.password, formData.confirmPassword, requirements]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "dni") {
      if (value === "" || /^\d+$/.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: StaffRole) => {
    setFormData((prev) => ({ ...prev, role: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const payload = {
        name: formData.name.trim(),
        surname: formData.surname.trim(),
        email: formData.email.trim(),
        dni: formData.dni ? formData.dni.trim() : undefined,
        password: formData.password,
        role: formData.role,
      };

      const { data } = await api.post("/users/create", payload);

      setSuccessMessage(
        `Cuenta de ${ROLE_LABEL[formData.role]} creada correctamente.`
      );
      setLastCreatedUser({
        name: data?.userCreated?.name ?? payload.name,
        surname: data?.userCreated?.surname ?? payload.surname,
        email: data?.userCreated?.email ?? payload.email,
        role: (data?.userCreated?.role as StaffRole) ?? formData.role,
      });

      setFormData((prev) => ({
        ...initialForm,
        role: prev.role,
      }));
    } catch (error: any) {
      const apiMessage = error?.response?.data?.message;
      setErrorMessage(apiMessage || "No se pudo crear la cuenta. Intenta nuevamente.");
      setSuccessMessage("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-with-nav-spacing">
      <div className="admin-users">
      <header className="admin-users__header">
        <h1>Gestionar usuarios internos</h1>
        <p>Genera credenciales para nuevos administradores o recepcionistas.</p>
      </header>

      <SuccessMessage message={successMessage} onClose={() => setSuccessMessage("")} />
      <ErrorMessage message={errorMessage} onClose={() => setErrorMessage("")} />

      <section className="panel">
        <div className="panel-header">
          <h2>Nueva cuenta interna</h2>
          <span className="panel-hint">Elige el rol y completa los datos obligatorios.</span>
        </div>
        <div className="panel-body">
          <form className="admin-users__form" onSubmit={handleSubmit}>
            <fieldset className="role-selector">
              <legend>Tipo de cuenta</legend>
              <div className="role-options">
                {ROLE_OPTIONS.map((option) => (
                  <button
                    type="button"
                    key={option.value}
                    className={`role-option ${formData.role === option.value ? "active" : ""}`}
                    onClick={() => handleRoleChange(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="form-columns">
              <div className="form-column">
                <Input
                  type="text"
                  name="name"
                  placeholder="Nombre"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <Input
                  type="text"
                  name="surname"
                  placeholder="Apellido"
                  value={formData.surname}
                  onChange={handleChange}
                  required
                />
                <Input
                  type="email"
                  name="email"
                  placeholder="Correo electronico"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <Input
                  type="text"
                  name="dni"
                  placeholder="DNI (opcional)"
                  value={formData.dni}
                  onChange={handleChange}
                  required={false}
                />
              </div>
              <div className="form-column">
                <PasswordInput
                  name="password"
                  placeholder="Contraseña"
                  value={formData.password}
                  onChange={handleChange}
                  strength={passwordStrength}
                />
                <ul className="staff-password-requirements">
                  {requirements.map((req) => (
                    <li key={req.text} className={req.valid ? "valid" : "invalid"}>
                      {req.text}
                    </li>
                  ))}
                </ul>
                <PasswordConfirm
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  match={matchMessage}
                  color={matchMessage === "Las contrasenas coinciden" ? "#22a341" : "#d9534f"}
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn primary"
                disabled={!isFormValid || isSubmitting}
              >
                {isSubmitting ? "Guardando..." : "Crear cuenta"}
              </button>
            </div>
          </form>
        </div>
      </section>

      {lastCreatedUser && (
        <section className="panel admin-users__summary">
          <div className="panel-header">
            <h2>Ultima cuenta creada</h2>
          </div>
          <div className="panel-body">
            <div className="summary-content">
              <span className="summary-name">{lastCreatedUser.name} {lastCreatedUser.surname}</span>
              <span className="summary-email">{lastCreatedUser.email}</span>
              <span className="summary-role">{ROLE_LABEL[lastCreatedUser.role]}</span>
            </div>
          </div>
        </section>
      )}
      </div>
    </div>
  );
};

export default AdminUsers;
