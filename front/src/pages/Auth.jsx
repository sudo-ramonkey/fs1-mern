import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
} from '@carbon/react';
import {
  User,
  Email,
  Phone,
  Location,
} from '@carbon/icons-react';
import {
  loginUser,
  registerUser,
  clearError,
  selectAuth,
} from '../redux/slices/authSlice';
import './Auth.css';

const Auth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, error } = useSelector(selectAuth);

  const [activeTab, setActiveTab] = useState(0);
  const [loginForm, setLoginForm] = useState({
    login: '',
    password: '',
  });
  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Mexico'
    },
    acceptTerms: false,
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Clear errors when switching tabs
    dispatch(clearError());
    setFormErrors({});
  }, [activeTab, dispatch]);

  const validateLoginForm = () => {
    const errors = {};
    if (!loginForm.login.trim()) {
      errors.login = 'Email o nombre de usuario requerido';
    }
    if (!loginForm.password) {
      errors.password = 'Contraseña requerida';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateRegisterForm = () => {
    const errors = {};
    
    if (!registerForm.username.trim()) {
      errors.username = 'Nombre de usuario requerido';
    } else if (registerForm.username.length < 3) {
      errors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
    }
    
    if (!registerForm.email.trim()) {
      errors.email = 'Email requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.email)) {
      errors.email = 'Email inválido';
    }
    
    if (!registerForm.password) {
      errors.password = 'Contraseña requerida';
    } else if (registerForm.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (!registerForm.confirmPassword) {
      errors.confirmPassword = 'Confirmar contraseña requerido';
    } else if (registerForm.password !== registerForm.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    if (!registerForm.firstName.trim()) {
      errors.firstName = 'Nombre requerido';
    }
    
    if (!registerForm.lastName.trim()) {
      errors.lastName = 'Apellido requerido';
    }
    
    if (!registerForm.acceptTerms) {
      errors.acceptTerms = 'Debe aceptar los términos y condiciones';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (validateLoginForm()) {
      dispatch(loginUser(loginForm));
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (validateRegisterForm()) {
      const { confirmPassword, acceptTerms, ...userData } = registerForm;
      
      // Clean up address object - remove empty fields
      const cleanAddress = {};
      Object.keys(userData.address).forEach(key => {
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
      
      dispatch(registerUser(userData));
    }
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
    // Clear specific field error
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRegisterChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle address fields separately
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setRegisterForm(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setRegisterForm(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    // Clear specific field error
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (isLoading) {
    return (
      <div className="auth-loading">
        <Loading description="Procesando..." />
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>🎵 MusicStore</h1>
          <p>Bienvenido a nuestra tienda de instrumentos musicales</p>
        </div>

        {error && (
          <InlineNotification
            kind="error"
            title="Error"
            subtitle={error}
            onCloseButtonClick={() => dispatch(clearError())}
            hideCloseButton={false}
          />
        )}

        <Tabs selectedIndex={activeTab} onChange={(data) => setActiveTab(data.selectedIndex)}>
          <TabList aria-label="Opciones de autenticación">
            <Tab>Iniciar Sesión</Tab>
            <Tab>Registrarse</Tab>
          </TabList>
          
          <TabPanels>
            {/* Login Panel */}
            <TabPanel>
              <Form onSubmit={handleLoginSubmit} className="auth-form">
                <div className="form-group">
                  <TextInput
                    id="login"
                    name="login"
                    labelText="Email o Nombre de Usuario"
                    placeholder="Ingresa tu email o nombre de usuario"
                    value={loginForm.login}
                    onChange={handleLoginChange}
                    invalid={!!formErrors.login}
                    invalidText={formErrors.login}
                    size="lg"
                  />
                  <User className="input-icon" />
                </div>

                <div className="form-group">
                  <PasswordInput
                    id="password"
                    name="password"
                    labelText="Contraseña"
                    placeholder="Ingresa tu contraseña"
                    value={loginForm.password}
                    onChange={handleLoginChange}
                    invalid={!!formErrors.password}
                    invalidText={formErrors.password}
                    size="lg"
                  />
                </div>

                <Button
                  type="submit"
                  kind="primary"
                  size="lg"
                  className="auth-submit-btn"
                  disabled={isLoading}
                >
                  Iniciar Sesión
                </Button>

                <div className="auth-footer">
                  <p>
                    ¿No tienes cuenta?{' '}
                    <button
                      type="button"
                      className="link-button"
                      onClick={() => setActiveTab(1)}
                    >
                      Regístrate aquí
                    </button>
                  </p>
                </div>
              </Form>
            </TabPanel>

            {/* Register Panel */}
            <TabPanel>
              <Form onSubmit={handleRegisterSubmit} className="auth-form">
                <div className="form-row">
                  <div className="form-group">
                    <TextInput
                      id="firstName"
                      name="firstName"
                      labelText="Nombre"
                      placeholder="Tu nombre"
                      value={registerForm.firstName}
                      onChange={handleRegisterChange}
                      invalid={!!formErrors.firstName}
                      invalidText={formErrors.firstName}
                      size="lg"
                    />
                  </div>
                  <div className="form-group">
                    <TextInput
                      id="lastName"
                      name="lastName"
                      labelText="Apellido"
                      placeholder="Tu apellido"
                      value={registerForm.lastName}
                      onChange={handleRegisterChange}
                      invalid={!!formErrors.lastName}
                      invalidText={formErrors.lastName}
                      size="lg"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <TextInput
                    id="username"
                    name="username"
                    labelText="Nombre de Usuario"
                    placeholder="Elige un nombre de usuario"
                    value={registerForm.username}
                    onChange={handleRegisterChange}
                    invalid={!!formErrors.username}
                    invalidText={formErrors.username}
                    size="lg"
                  />
                  <User className="input-icon" />
                </div>

                <div className="form-group">
                  <TextInput
                    id="email"
                    name="email"
                    type="email"
                    labelText="Email"
                    placeholder="tu@email.com"
                    value={registerForm.email}
                    onChange={handleRegisterChange}
                    invalid={!!formErrors.email}
                    invalidText={formErrors.email}
                    size="lg"
                  />
                  <Email className="input-icon" />
                </div>

                <div className="form-group">
                  <TextInput
                    id="phone"
                    name="phone"
                    type="tel"
                    labelText="Teléfono (Opcional)"
                    placeholder="+52 123 456 7890"
                    value={registerForm.phone}
                    onChange={handleRegisterChange}
                    size="lg"
                  />
                  <Phone className="input-icon" />
                </div>

                <div className="form-group">
                  <TextInput
                    id="address.street"
                    name="address.street"
                    labelText="Calle y Número (Opcional)"
                    placeholder="Ej: Av. Principal 123"
                    value={registerForm.address.street}
                    onChange={handleRegisterChange}
                    size="lg"
                  />
                  <Location className="input-icon" />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <TextInput
                      id="address.city"
                      name="address.city"
                      labelText="Ciudad (Opcional)"
                      placeholder="Ej: Guadalajara"
                      value={registerForm.address.city}
                      onChange={handleRegisterChange}
                      size="lg"
                    />
                  </div>
                  <div className="form-group">
                    <TextInput
                      id="address.state"
                      name="address.state"
                      labelText="Estado (Opcional)"
                      placeholder="Ej: Jalisco"
                      value={registerForm.address.state}
                      onChange={handleRegisterChange}
                      size="lg"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <TextInput
                      id="address.zipCode"
                      name="address.zipCode"
                      labelText="Código Postal (Opcional)"
                      placeholder="Ej: 44100"
                      value={registerForm.address.zipCode}
                      onChange={handleRegisterChange}
                      size="lg"
                    />
                  </div>
                  <div className="form-group">
                    <TextInput
                      id="address.country"
                      name="address.country"
                      labelText="País"
                      placeholder="México"
                      value={registerForm.address.country}
                      onChange={handleRegisterChange}
                      size="lg"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <PasswordInput
                      id="password"
                      name="password"
                      labelText="Contraseña"
                      placeholder="Mínimo 6 caracteres"
                      value={registerForm.password}
                      onChange={handleRegisterChange}
                      invalid={!!formErrors.password}
                      invalidText={formErrors.password}
                      size="lg"
                    />
                  </div>
                  <div className="form-group">
                    <PasswordInput
                      id="confirmPassword"
                      name="confirmPassword"
                      labelText="Confirmar Contraseña"
                      placeholder="Repite tu contraseña"
                      value={registerForm.confirmPassword}
                      onChange={handleRegisterChange}
                      invalid={!!formErrors.confirmPassword}
                      invalidText={formErrors.confirmPassword}
                      size="lg"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <Checkbox
                    id="acceptTerms"
                    name="acceptTerms"
                    labelText="Acepto los términos y condiciones"
                    checked={registerForm.acceptTerms}
                    onChange={handleRegisterChange}
                  />
                  {formErrors.acceptTerms && (
                    <div className="error-text">{formErrors.acceptTerms}</div>
                  )}
                </div>

                <Button
                  type="submit"
                  kind="primary"
                  size="lg"
                  className="auth-submit-btn"
                  disabled={isLoading}
                >
                  Crear Cuenta
                </Button>

                <div className="auth-footer">
                  <p>
                    ¿Ya tienes cuenta?{' '}
                    <button
                      type="button"
                      className="link-button"
                      onClick={() => setActiveTab(0)}
                    >
                      Inicia sesión aquí
                    </button>
                  </p>
                </div>
              </Form>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
