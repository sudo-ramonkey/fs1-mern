import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Form,
  TextInput,
  PasswordInput,
  Button,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  InlineNotification,
  Loading,
  Checkbox,
  Grid,
  Column,
  Card,
  Tile,
} from "@carbon/react";
import {
  User,
  Email,
  Phone,
  Location,
  Password,
  Save,
  Edit,
} from "@carbon/react/icons";
import {
  updateUserProfile,
  changeUserPassword,
  clearError,
  selectAuth,
} from "../redux/slices/authSlice";
import "./Profile.css";

const Profile = () => {
  const dispatch = useDispatch();
  const { user, isLoading, error } = useSelector(selectAuth);

  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "Mexico",
    },
    preferences: {
      newsletter: false,
      notifications: true,
    },
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState({});

  // Initialize form with user data when component mounts or user data changes
  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        address: {
          street: user.address?.street || "",
          city: user.address?.city || "",
          state: user.address?.state || "",
          zipCode: user.address?.zipCode || "",
          country: user.address?.country || "Mexico",
        },
        preferences: {
          newsletter: user.preferences?.newsletter || false,
          notifications: user.preferences?.notifications !== false,
        },
      });
    }
  }, [user]);

  // Clear errors when switching tabs
  useEffect(() => {
    dispatch(clearError());
    setFormErrors({});
  }, [activeTab, dispatch]);

  const validateProfileForm = () => {
    const errors = {};

    if (!profileForm.firstName.trim()) {
      errors.firstName = "Nombre requerido";
    }

    if (!profileForm.lastName.trim()) {
      errors.lastName = "Apellido requerido";
    }

    if (!profileForm.username.trim()) {
      errors.username = "Nombre de usuario requerido";
    } else if (profileForm.username.length < 3) {
      errors.username = "El nombre de usuario debe tener al menos 3 caracteres";
    }

    if (!profileForm.email.trim()) {
      errors.email = "Email requerido";
    } else if (
      !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(profileForm.email)
    ) {
      errors.email = "Email inválido";
    }

    if (
      profileForm.phone &&
      !/^\+?[\d\s\-\(\)]{10,}$/.test(profileForm.phone)
    ) {
      errors.phone = "Número de teléfono inválido";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePasswordForm = () => {
    const errors = {};

    if (!passwordForm.currentPassword) {
      errors.currentPassword = "Contraseña actual requerida";
    }

    if (!passwordForm.newPassword) {
      errors.newPassword = "Nueva contraseña requerida";
    } else if (passwordForm.newPassword.length < 6) {
      errors.newPassword = "La contraseña debe tener al menos 6 caracteres";
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = "Las contraseñas no coinciden";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setProfileForm((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else if (name.startsWith("preferences.")) {
      const prefField = name.split(".")[1];
      setProfileForm((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [prefField]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setProfileForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }

    // Clear specific field error
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));

    // Clear specific field error
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (validateProfileForm()) {
      const { confirmPassword, ...userData } = profileForm;

      // Clean up address object - remove empty fields
      const cleanAddress = {};
      Object.keys(userData.address).forEach((key) => {
        if (userData.address[key] && userData.address[key].trim()) {
          cleanAddress[key] = userData.address[key].trim();
        }
      });

      // Only include address if it has at least one field
      if (Object.keys(cleanAddress).length > 0) {
        userData.address = cleanAddress;
      } else {
        delete userData.address;
      }

      const result = await dispatch(updateUserProfile(userData));
      if (updateUserProfile.fulfilled.match(result)) {
        setIsEditing(false);
      }
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (validatePasswordForm()) {
      const result = await dispatch(
        changeUserPassword({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        })
      );

      if (changeUserPassword.fulfilled.match(result)) {
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="profile-loading">
        <Loading description="Cargando perfil..." />
      </div>
    );
  }
  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Mi Perfil</h1>
        <p>Gestiona tu información personal y configuración de cuenta</p>
      </div>
      {error && (
        <InlineNotification
          kind="error"
          title="Error"
          subtitle={error}
          onCloseButtonClick={() => dispatch(clearError())}
          hideCloseButton={false}
          className="profile-notification"
        />
      )}{" "}
      <div className="profile-content">
        <Tabs
          selectedIndex={activeTab}
          onChange={(data) => setActiveTab(data.selectedIndex)}
        >
          <TabList aria-label="Opciones de perfil">
            <Tab>Información Personal</Tab>
            <Tab>Cambiar Contraseña</Tab>
          </TabList>

          <TabPanels>
            {/* Personal Information Panel */}
            <TabPanel>
              <Grid>
                <Column lg={16} md={8} sm={4}>
                  <Tile className="profile-tile">
                    <div className="profile-section-header">
                      <h3>Información Personal</h3>
                      {!isEditing ? (
                        <Button
                          kind="tertiary"
                          size="sm"
                          renderIcon={Edit}
                          onClick={() => setIsEditing(true)}
                        >
                          Editar
                        </Button>
                      ) : (
                        <div className="profile-edit-actions">
                          <Button
                            kind="secondary"
                            size="sm"
                            onClick={() => setIsEditing(false)}
                          >
                            Cancelar
                          </Button>
                        </div>
                      )}
                    </div>

                    <Form
                      onSubmit={handleProfileSubmit}
                      className="profile-form"
                    >
                      <Grid>
                        {/* Basic Information */}
                        <Column lg={6} md={4} sm={4}>
                          <div className="form-group">
                            <TextInput
                              id="firstName"
                              name="firstName"
                              labelText="Nombre"
                              placeholder="Tu nombre"
                              value={profileForm.firstName}
                              onChange={handleProfileChange}
                              invalid={!!formErrors.firstName}
                              invalidText={formErrors.firstName}
                              disabled={!isEditing}
                              size="lg"
                            />
                          </div>
                        </Column>
                        <Column lg={6} md={4} sm={4}>
                          <div className="form-group">
                            <TextInput
                              id="lastName"
                              name="lastName"
                              labelText="Apellido"
                              placeholder="Tu apellido"
                              value={profileForm.lastName}
                              onChange={handleProfileChange}
                              invalid={!!formErrors.lastName}
                              invalidText={formErrors.lastName}
                              disabled={!isEditing}
                              size="lg"
                            />
                          </div>
                        </Column>
                        <Column lg={6} md={4} sm={4}>
                          <div className="form-group">
                            <TextInput
                              id="username"
                              name="username"
                              labelText="Nombre de Usuario"
                              placeholder="Nombre de usuario"
                              value={profileForm.username}
                              onChange={handleProfileChange}
                              invalid={!!formErrors.username}
                              invalidText={formErrors.username}
                              disabled={!isEditing}
                              size="lg"
                            />
                            <User className="input-icon" />
                          </div>
                        </Column>
                        <Column lg={6} md={4} sm={4}>
                          <div className="form-group">
                            <TextInput
                              id="email"
                              name="email"
                              type="email"
                              labelText="Email"
                              placeholder="tu@email.com"
                              value={profileForm.email}
                              onChange={handleProfileChange}
                              invalid={!!formErrors.email}
                              invalidText={formErrors.email}
                              disabled={!isEditing}
                              size="lg"
                            />
                            <Email className="input-icon" />
                          </div>
                        </Column>
                        <Column lg={6} md={4} sm={4}>
                          <div className="form-group">
                            <TextInput
                              id="phone"
                              name="phone"
                              type="tel"
                              labelText="Teléfono"
                              placeholder="+52 123 456 7890"
                              value={profileForm.phone}
                              onChange={handleProfileChange}
                              invalid={!!formErrors.phone}
                              invalidText={formErrors.phone}
                              disabled={!isEditing}
                              size="lg"
                            />
                            <Phone className="input-icon" />
                          </div>
                        </Column>
                        <Column lg={4} md={4} sm={4}>
                          <div className="form-group">
                            <TextInput
                              id="address.street"
                              name="address.street"
                              labelText="Calle y Número"
                              placeholder="Calle Principal #123"
                              value={profileForm.address.street}
                              onChange={handleProfileChange}
                              disabled={!isEditing}
                              size="lg"
                            />
                          </div>
                        </Column>
                        <Column lg={4} md={4} sm={4}>
                          <div className="form-group">
                            <TextInput
                              id="address.city"
                              name="address.city"
                              labelText="Ciudad"
                              placeholder="Ciudad"
                              value={profileForm.address.city}
                              onChange={handleProfileChange}
                              disabled={!isEditing}
                              size="lg"
                            />
                          </div>
                        </Column>
                        <Column lg={4} md={4} sm={4}>
                          <div className="form-group">
                            <TextInput
                              id="address.state"
                              name="address.state"
                              labelText="Estado"
                              placeholder="Estado"
                              value={profileForm.address.state}
                              onChange={handleProfileChange}
                              disabled={!isEditing}
                              size="lg"
                            />
                          </div>
                        </Column>
                        <Column lg={4} md={4} sm={4}>
                          <div className="form-group">
                            <TextInput
                              id="address.zipCode"
                              name="address.zipCode"
                              labelText="Código Postal"
                              placeholder="12345"
                              value={profileForm.address.zipCode}
                              onChange={handleProfileChange}
                              disabled={!isEditing}
                              size="lg"
                            />
                          </div>
                        </Column>
                        {/* Preferences */}
                        <Column lg={12}>
                          <h4 className="subsection-title">Preferencias</h4>
                        </Column>
                        <Column lg={6} md={4} sm={4}>
                          <div className="form-group">
                            <Checkbox
                              id="preferences.newsletter"
                              name="preferences.newsletter"
                              labelText="Recibir newsletter"
                              checked={profileForm.preferences.newsletter}
                              onChange={handleProfileChange}
                              disabled={!isEditing}
                            />
                          </div>
                        </Column>
                        <Column lg={6} md={4} sm={4}>
                          <div className="form-group">
                            <Checkbox
                              id="preferences.notifications"
                              name="preferences.notifications"
                              labelText="Recibir notificaciones"
                              checked={profileForm.preferences.notifications}
                              onChange={handleProfileChange}
                              disabled={!isEditing}
                            />
                          </div>
                        </Column>{" "}
                        {isEditing && (
                          <Column lg={16} md={8} sm={4}>
                            <div className="form-actions">
                              <Button
                                type="submit"
                                kind="primary"
                                size="lg"
                                disabled={isLoading}
                              >
                                Guardar Cambios
                              </Button>
                            </div>
                          </Column>
                        )}
                      </Grid>{" "}
                    </Form>
                  </Tile>
                </Column>
              </Grid>
            </TabPanel>

            {/* Change Password Panel */}
            <TabPanel>
              <Grid>
                <Column lg={16} md={8} sm={4}>
                  <Tile className="profile-tile">
                    <div className="profile-section-header">
                      <h3>Cambiar Contraseña</h3>
                      <p>
                        Para tu seguridad, necesitas ingresar tu contraseña
                        actual
                      </p>
                    </div>

                    <Form
                      onSubmit={handlePasswordSubmit}
                      className="profile-form"
                    >
                      <Grid>
                        <Column lg={8} md={6} sm={4}>
                          <div className="form-group">
                            <PasswordInput
                              id="currentPassword"
                              name="currentPassword"
                              labelText="Contraseña Actual"
                              placeholder="Ingresa tu contraseña actual"
                              value={passwordForm.currentPassword}
                              onChange={handlePasswordChange}
                              invalid={!!formErrors.currentPassword}
                              invalidText={formErrors.currentPassword}
                              size="lg"
                            />
                          </div>
                        </Column>
                        <Column lg={8} md={6} sm={4}>
                          <div className="form-group">
                            <PasswordInput
                              id="newPassword"
                              name="newPassword"
                              labelText="Nueva Contraseña"
                              placeholder="Ingresa tu nueva contraseña"
                              value={passwordForm.newPassword}
                              onChange={handlePasswordChange}
                              invalid={!!formErrors.newPassword}
                              invalidText={formErrors.newPassword}
                              size="lg"
                            />
                          </div>
                        </Column>
                        <Column lg={8} md={6} sm={4}>
                          <div className="form-group">
                            <PasswordInput
                              id="confirmPassword"
                              name="confirmPassword"
                              labelText="Confirmar Nueva Contraseña"
                              placeholder="Confirma tu nueva contraseña"
                              value={passwordForm.confirmPassword}
                              onChange={handlePasswordChange}
                              invalid={!!formErrors.confirmPassword}
                              invalidText={formErrors.confirmPassword}
                              size="lg"
                            />
                          </div>
                        </Column>{" "}
                        <Column lg={16} md={8} sm={4}>
                          <div className="form-actions">
                            <Button
                              type="submit"
                              kind="primary"
                              size="lg"
                              renderIcon={Password}
                              disabled={isLoading}
                            >
                              Cambiar Contraseña
                            </Button>
                          </div>
                        </Column>
                      </Grid>
                    </Form>
                  </Tile>
                </Column>
              </Grid>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
