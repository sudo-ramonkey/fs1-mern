import React, { useState } from 'react';
import {
  Grid,
  Column,
  Breadcrumb,
  BreadcrumbItem,
  TextInput,
  TextArea,
  Button,
  Tile,
  Section,
  Heading,
  Form,
  Select,
  SelectItem,
  InlineNotification,
} from '@carbon/react';
import {
  Location,
  Phone,
  Email,
  Time,
  Send,
  Chat,
  Help,
} from '@carbon/react/icons';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    contactReason: ''
  });
  const [showNotification, setShowNotification] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    console.log('Form submitted:', formData);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 5000);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      contactReason: ''
    });
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <Section className="contact-hero">
        <Grid>
          <Column lg={16} md={8} sm={4}>
            <div className="hero-content">
              <div className="hero-icon">
                <Chat size={48} />
              </div>
              <Heading className="hero-title">
                💬 Contáctanos
              </Heading>
              <p className="hero-description">
                ¿Tienes preguntas? ¡Estamos aquí para ayudarte! 
                Contáctanos por cualquier consulta sobre nuestros productos o servicios.
              </p>
            </div>
          </Column>
        </Grid>
      </Section>

      {/* Breadcrumb */}
      <Section className="contact-breadcrumb">
        <Grid>
          <Column lg={16} md={8} sm={4}>
            <Breadcrumb>
              <BreadcrumbItem href="/">Inicio</BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>Contacto</BreadcrumbItem>
            </Breadcrumb>
          </Column>
        </Grid>
      </Section>

      {/* Contact Info & Form */}
      <Section className="contact-content">
        <Grid>
          {/* Contact Information */}
          <Column lg={6} md={4} sm={4}>
            <div className="contact-info">
              <Heading className="info-title">
                📍 Información de Contacto
              </Heading>
              <p className="info-subtitle">
                Ponte en contacto con nosotros a través de cualquiera de estos medios
              </p>

              <div className="contact-methods">
                <Tile className="contact-method">
                  <div className="method-icon">
                    <Location size={24} />
                  </div>
                  <div className="method-details">
                    <h4>Dirección</h4>
                    <p>Av. Revolución 123<br />Col. Centro, Torreón, Coah.<br />CP 27000</p>
                  </div>
                </Tile>

                <Tile className="contact-method">
                  <div className="method-icon">
                    <Phone size={24} />
                  </div>
                  <div className="method-details">
                    <h4>Teléfono</h4>
                    <p>+52 871 123 4567<br />+52 871 765 4321</p>
                  </div>
                </Tile>

                <Tile className="contact-method">
                  <div className="method-icon">
                    <Email size={24} />
                  </div>                  <div className="method-details">
                    <h4>Email</h4>
                    <p>info@elmundodelasguiarras.com<br />soporte@elmundodelasguiarras.com</p>
                  </div>
                </Tile>

                <Tile className="contact-method">
                  <div className="method-icon">
                    <Time size={24} />
                  </div>
                  <div className="method-details">
                    <h4>Horarios</h4>
                    <p>Lun - Vie: 9:00 AM - 7:00 PM<br />Sáb: 10:00 AM - 6:00 PM<br />Dom: 11:00 AM - 4:00 PM</p>
                  </div>
                </Tile>
              </div>
            </div>
          </Column>

          {/* Contact Form */}
          <Column lg={10} md={4} sm={4}>
            <div className="contact-form-container">
              <Tile className="contact-form-tile">
                <Heading className="form-title">
                  📝 Envíanos un Mensaje
                </Heading>
                <p className="form-subtitle">
                  Completa el formulario y te responderemos lo antes posible
                </p>

                {showNotification && (
                  <InlineNotification
                    kind="success"
                    title="¡Mensaje enviado!"
                    subtitle="Gracias por contactarnos. Te responderemos pronto."
                    hideCloseButton={false}
                    onCloseButtonClick={() => setShowNotification(false)}
                  />
                )}

                <Form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-row">
                    <TextInput
                      id="name"
                      name="name"
                      labelText="Nombre completo *"
                      placeholder="Tu nombre completo"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <TextInput
                      id="email"
                      name="email"
                      type="email"
                      labelText="Email *"
                      placeholder="tu@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <TextInput
                      id="phone"
                      name="phone"
                      type="tel"
                      labelText="Teléfono"
                      placeholder="+52 871 123 4567"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-row">
                    <Select
                      id="contactReason"
                      name="contactReason"
                      labelText="Motivo de contacto *"
                      value={formData.contactReason}
                      onChange={handleInputChange}
                      required
                    >
                      <SelectItem value="" text="Selecciona un motivo" />
                      <SelectItem value="consulta-producto" text="Consulta sobre producto" />
                      <SelectItem value="soporte-tecnico" text="Soporte técnico" />
                      <SelectItem value="reparaciones" text="Servicio de reparaciones" />
                      <SelectItem value="clases" text="Clases de música" />
                      <SelectItem value="cotizacion" text="Solicitar cotización" />
                      <SelectItem value="sugerencia" text="Sugerencia o comentario" />
                      <SelectItem value="otro" text="Otro" />
                    </Select>
                  </div>

                  <div className="form-row">
                    <TextInput
                      id="subject"
                      name="subject"
                      labelText="Asunto *"
                      placeholder="¿En qué podemos ayudarte?"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <TextArea
                      id="message"
                      name="message"
                      labelText="Mensaje *"
                      placeholder="Escribe tu mensaje aquí..."
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-actions">
                    <Button
                      type="submit"
                      kind="primary"
                      size="lg"
                      renderIcon={Send}
                      className="submit-btn"
                    >
                      Enviar Mensaje
                    </Button>
                  </div>
                </Form>
              </Tile>
            </div>
          </Column>
        </Grid>
      </Section>

      {/* FAQ Section */}
      <Section className="contact-faq">
        <Grid>
          <Column lg={16} md={8} sm={4}>
            <div className="faq-header">
              <Heading className="faq-title">
                ❓ Preguntas Frecuentes
              </Heading>
              <p className="faq-subtitle">
                Encuentra respuestas rápidas a las preguntas más comunes
              </p>
            </div>
          </Column>
        </Grid>
        
        <Grid className="faq-grid">
          <Column lg={8} md={4} sm={4}>
            <Tile className="faq-item">
              <h4>¿Ofrecen garantía en sus productos?</h4>
              <p>Sí, todos nuestros instrumentos incluyen garantía del fabricante. Los instrumentos nuevos tienen garantía de 1-2 años, y los usados de 6 meses.</p>
            </Tile>
          </Column>
          
          <Column lg={8} md={4} sm={4}>
            <Tile className="faq-item">
              <h4>¿Hacen reparaciones?</h4>
              <p>¡Por supuesto! Contamos con técnicos especializados en reparación de instrumentos de cuerda, viento y percusión. Solicita una cotización.</p>
            </Tile>
          </Column>

          <Column lg={8} md={4} sm={4}>
            <Tile className="faq-item">
              <h4>¿Ofrecen clases de música?</h4>
              <p>Sí, tenemos instructores certificados para guitarra, piano, violín, batería y más. Clases individuales y grupales disponibles.</p>
            </Tile>
          </Column>

          <Column lg={8} md={4} sm={4}>
            <Tile className="faq-item">
              <h4>¿Aceptan instrumentos en parte de pago?</h4>
              <p>Evaluamos instrumentos usados para parte de pago. Trae tu instrumento para una evaluación gratuita y conoce su valor.</p>
            </Tile>
          </Column>
        </Grid>
      </Section>

      {/* Map Section */}
      <Section className="contact-map">
        <Grid>
          <Column lg={16} md={8} sm={4}>
            <div className="map-header">
              <Heading className="map-title">
                🗺️ Encuéntranos
              </Heading>
              <p className="map-subtitle">
                Visita nuestra tienda física en el corazón de Torreón
              </p>
            </div>
            <Tile className="map-container">
              <div className="map-placeholder">
                <Location size={48} />
                <p>Mapa interactivo</p>
                <p className="map-address">Av. Revolución 123, Col. Centro, Torreón, Coah.</p>
                <Button kind="secondary" size="md">
                  Ver en Google Maps
                </Button>
              </div>
            </Tile>
          </Column>
        </Grid>
      </Section>
    </div>
  );
};

export default Contact;
