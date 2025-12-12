import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import Input from "../components/Input";
import PasswordInput from "../components/PasswordInput";
import PasswordConfirm from "../components/PasswordConfirm";
import "../styles/profileEdit.css";
import WhatsAppButton from "../components/WhatsAppButton";
import axios from "axios";
import SuccessMessage from "../components/SuccessMessage";
import ErrorMessage from "../components/ErrorMessage";

interface Profile {
  name: string;
  surname?: string;
  email: string;
  dni?: string;
}

interface Passwords {
  actual: string;
  new: string;
  confirm: string;
}

interface PasswordStrength {
  strength: number;
  label: string;
  color: string;
  width: string;
}

interface ProfileEditProps {
  user: {
    idUser: number;
    name: string;
    surname?: string;
    email: string;
    dni?: string;
  } | null;
  setUser: (user: any) => void;
}

const ProfileEdit: React.FC<ProfileEditProps> = ({ user, setUser }) => {
  const [profile, setProfile] = useState<Profile>({
    name: "",
    email: "",
    surname: "",
    dni: "",
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [originalProfile, setOriginalProfile] = useState<Profile>({
    name: "",
    email: "",
    surname: "",
    dni: "",
  });

  useEffect(() => {
    if (user) {
      const userProfile = {
        name: user.name || "",
        surname: user.surname || "",
        email: user.email || "",
        dni: user.dni || "",
      };
      setProfile(userProfile);
      setOriginalProfile(userProfile);
    }
  }, [user]);

  const [editMode, setEditMode] = useState({
    name: false,
    surname: false,
    email: false,
    dni: false,
  });

  const [passwords, setPasswords] = useState<Passwords>({
    actual: "",
    new: "",
    confirm: "",
  });

  const [passwordErrors, setPasswordErrors] = useState({
    samePassword: false,
  });

  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    strength: 0,
    label: "",
    color: "",
    width: "0%",
  });

  const [requirements, setRequirements] = useState([
    { text: "Debe tener al menos 6 caracteres", valid: false },
    { text: "Debe contener al menos una mayúscula", valid: false },
    { text: "Debe contener al menos un número", valid: false },
    { text: "Debe ser diferente de la contraseña actual", valid: false },
  ]);

  const hasProfileChanges = () => {
    return (
      profile.name !== originalProfile.name ||
      profile.surname !== originalProfile.surname ||
      profile.email !== originalProfile.email ||
      profile.dni !== originalProfile.dni
    );
  };

  const canUpdatePassword = () => {
    return (
      passwords.actual.trim() !== "" &&
      passwords.new.trim() !== "" &&
      passwords.confirm.trim() !== "" &&
      passwords.new === passwords.confirm &&
      passwords.new !== passwords.actual &&
      requirements.every((req) => req.valid)
    );
  };

  const handleProfileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const toggleEditMode = (fieldName: keyof Profile) => {
    setEditMode({ ...editMode, [fieldName]: !editMode[fieldName] });
  };

  const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });

    if (name === "new" || name === "actual") {
      setPasswordErrors({
        ...passwordErrors,
        samePassword:
          passwords.new === passwords.actual &&
          passwords.new !== "" &&
          passwords.actual !== "",
      });
    }

    if (name === "new") {
      const newReqs = [
        { text: "Debe tener al menos 6 caracteres", valid: value.length >= 6 },
        {
          text: "Debe contener al menos una mayúscula",
          valid: /[A-Z]/.test(value),
        },
        {
          text: "Debe contener al menos un número",
          valid: /[0-9]/.test(value),
        },
        {
          text: "Debe ser diferente de la contraseña actual",
          valid: value !== passwords.actual,
        },
      ];
      setRequirements(newReqs);

      const strength = newReqs.filter((r) => r.valid).length;
      const strengthMap = [
        { width: "0%", label: "", color: "" },
        { width: "25%", label: "Muy Débil", color: "red" },
        { width: "50%", label: "Débil", color: "orange" },
        { width: "75%", label: "Media", color: "yellow" },
        { width: "100%", label: "Fuerte", color: "green" },
      ];
      setPasswordStrength({ strength, ...strengthMap[strength] });
    }
  };

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const dataToSend = {
      ...profile,
      dni: profile.dni === "" ? null : profile.dni,
    };

    console.log("📤 Datos a enviar:", dataToSend);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/update/${user?.idUser}`,
        dataToSend, // ← Usar dataToSend en lugar de profile
        {
          headers: {
            "Content-Type": "application/json",
            "x-token": token,
          },
        }
      );

      if (response.status === 200) {
        const updatedUser = response.data.userToUpdate;
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setOriginalProfile(profile);
        setSuccessMessage("Perfil actualizado correctamente");
        setEditMode({ name: false, surname: false, email: false, dni: false });

        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } else {
        setErrorMessage("Error al actualizar el perfil");
        setTimeout(() => {
          setErrorMessage("");
        }, 3000);
      }
    } catch (error: any) {
      console.error("Error:", error);
      setErrorMessage(
        error.response?.data?.message || "Error al actualizar el perfil"
      );
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!canUpdatePassword()) {
      setErrorMessage("Por favor, completa todos los campos correctamente");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/change-password/${user?.idUser}`,
        {
          currentPassword: passwords.actual,
          newPassword: passwords.new,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-token": token,
          },
        }
      );

      if (response.status === 200) {
        setSuccessMessage("Contraseña cambiada correctamente");
        setTimeout(() => {
          setPasswords({ actual: "", new: "", confirm: "" });
          setPasswordStrength({ strength: 0, label: "", color: "", width: "0%" });
          setRequirements(requirements.map((req) => ({ ...req, valid: false })));
          setSuccessMessage("");
        }, 3000);
      } else {
        setErrorMessage("Error al cambiar la contraseña");
        setTimeout(() => {
          setErrorMessage("");
        }, 3000);
      }
    } catch (error: any) {
      console.error("Error:", error);
      setErrorMessage(
        error.response?.data?.message || "Error al cambiar la contraseña"
      );
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
  };

  if (!user) {
    return (
      <div className="profile-edit-container">
        <h2>Editar Perfil</h2>
        <p>Por favor, inicia sesión para acceder a esta página.</p>
      </div>
    );
  }

  if (user && (user as any).role === 'receptionist') {
    return (
      <div className="profile-edit-container">
        <h2>Editar Perfil</h2>
        <p>Esta sección no está disponible para recepcionistas.</p>
      </div>
    );
  }

  return (
    <div className="profile-edit-container">
      {successMessage && (
        <SuccessMessage
          message={successMessage}
          onClose={() => setSuccessMessage("")}
        />
      )}
      {errorMessage && (
        <ErrorMessage
          message={errorMessage}
          onClose={() => setErrorMessage("")}
        />
      )}
      <h2>Editar Perfil</h2>

      <div className="profile-edit-columns">
        <div className="profile-column">
          <form onSubmit={handleProfileSubmit} className="profile-form">
            <h3>Información Personal</h3>

            <div
              className="profile-field"
              onClick={() => toggleEditMode("name")}
            >
              <label>Nombre</label>
              <div className="profile-input-container">
                {editMode.name ? (
                  <Input
                    type="text"
                    name="name"
                    placeholder="Ingresa tu nombre"
                    value={profile.name}
                    onChange={handleProfileChange}
                    onClick={handleInputClick}
                    required
                  />
                ) : (
                  <p>{profile.name || "No especificado"}</p>
                )}
              </div>
            </div>

            <div
              className="profile-field"
              onClick={() => toggleEditMode("surname")}
            >
              <label>Apellido</label>
              <div className="profile-input-container">
                {editMode.surname ? (
                  <Input
                    type="text"
                    name="surname"
                    placeholder="Ingresa tu apellido"
                    value={profile.surname || ""}
                    onChange={handleProfileChange}
                    onClick={handleInputClick}
                  />
                ) : (
                  <p>{profile.surname || "No especificado"}</p>
                )}
              </div>
            </div>

            <div
              className="profile-field"
              onClick={() => toggleEditMode("dni")}
            >
              <label>DNI</label>
              <div className="profile-input-container">
                {editMode.dni ? (
                  <Input
                    type="text"
                    name="dni"
                    placeholder="Ingresa tu DNI"
                    value={profile.dni || ""}
                    onChange={handleProfileChange}
                    onClick={handleInputClick}
                  />
                ) : (
                  <p>{profile.dni || "No especificado"}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className={hasProfileChanges() ? "allow" : "disabled"}
              disabled={!hasProfileChanges()}
            >
              Actualizar datos
            </button>
          </form>
        </div>

        <div className="password-column">
          <form onSubmit={handlePasswordSubmit} className="password-form">
            <h3>Cambiar Contraseña</h3>

            <PasswordInput
              name="actual"
              value={passwords.actual}
              onChange={handlePasswordChange}
              placeholder="Ingresa tu contraseña actual"
            />

            <PasswordInput
              name="new"
              value={passwords.new}
              onChange={handlePasswordChange}
              placeholder="Ingresa tu nueva contraseña"
              strength={passwordStrength}
            />

            {/* Password requirements */}
            <ul className="password-requirements">
              {requirements.map((req, idx) => (
                <li key={idx} className={req.valid ? "valid" : "invalid"}>
                  {req.text}
                </li>
              ))}
            </ul>

            <PasswordConfirm
              name="confirm"
              value={passwords.confirm}
              onChange={handlePasswordChange}
              match={
                passwords.new === passwords.confirm
                  ? "Las contraseñas coinciden"
                  : "Las contraseñas no coinciden"
              }
              color={passwords.new === passwords.confirm ? "green" : "red"}
            />

            <button
              type="submit"
              className={canUpdatePassword() ? "allow" : "disabled"}
              disabled={!canUpdatePassword()}
            >
              Actualizar contraseña
            </button>
          </form>
        </div>
      </div>

      <WhatsAppButton />
    </div>
  );
};

export default ProfileEdit;
