"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Monitor, Phone, Mail, MapPin, Star, CheckCircle, Wrench, Database, Cpu } from "lucide-react"
import ChatBot from "@/components/chat-bot"
import { MaintenanceForm } from "@/components/maintenance-form"

export default function LandingPage() {
  const [showChat, setShowChat] = useState(false)
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false)

  const services = [
    {
      icon: <Wrench className="h-8 w-8" />,
      title: "Mantenimiento de Computadores",
      description: "Limpieza, optimización y reparación de equipos para mantener su rendimiento óptimo.",
      features: [
        "Limpieza interna y externa",
        "Optimización del sistema",
        "Diagnóstico de problemas",
        "Actualización de drivers",
      ],
    },
    {
      icon: <Cpu className="h-8 w-8" />,
      title: "Instalación y Venta de Hardware",
      description: "Instalación profesional y venta de componentes de alta calidad para mejorar tu equipo.",
      features: ["Memoria RAM", "Discos duros SSD/HDD", "Tarjetas gráficas", "Procesadores y motherboards"],
    },
    {
      icon: <Database className="h-8 w-8" />,
      title: "Servicios de Backup",
      description: "Protege tu información importante con soluciones de respaldo confiables y seguras.",
      features: [
        "Backup automático",
        "Recuperación de datos",
        "Almacenamiento en la nube",
        "Copias de seguridad locales",
      ],
    },
  ]

  const testimonials = [
    {
      name: "María González",
      text: "Excelente servicio de mantenimiento. Mi computador quedó como nuevo.",
      rating: 5,
    },
    {
      name: "Carlos Rodríguez",
      text: "Muy profesional en la instalación de mi nueva tarjeta gráfica.",
      rating: 5,
    },
    {
      name: "Ana López",
      text: "El servicio de backup me salvó cuando perdí mis archivos importantes.",
      rating: 5,
    },
  ]

  const handleWhatsAppContact = () => {
    const message = "Hola! Me interesa conocer más sobre tus servicios de tecnología."
    const phoneNumber = "3217307703" // Reemplaza con tu número real
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(url, "_blank")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Monitor className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">TechServices</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#servicios" className="text-gray-700 hover:text-blue-600 transition-colors">
                Servicios
              </a>
              <a href="#sobre-mi" className="text-gray-700 hover:text-blue-600 transition-colors">
                Sobre Mí
              </a>
              <a href="#contacto" className="text-gray-700 hover:text-blue-600 transition-colors">
                Contacto
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            COMPUTADORES
            <span className="text-blue-600 block">tecnologicos</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Soporte técnico - Instalación de software - Ventas de repuestos - Backup
            <br />
            Brindamos un buen servicio a domicilio
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleWhatsAppContact} className="bg-green-600 hover:bg-green-700 text-white">
              <MessageCircle className="mr-2 h-5 w-5" />
              Contactar por WhatsApp
            </Button>
            <Button size="lg" variant="outline" onClick={() => setShowChat(true)}>
              <MessageCircle className="mr-2 h-5 w-5" />
              Chat con Asistente
            </Button>
            <Button
              size="lg"
              onClick={() => setShowMaintenanceForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Wrench className="mr-2 h-5 w-5" />
              Agendar Mantenimiento
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Mis Servicios</h2>
            <p className="text-xl text-gray-600">Soluciones completas para todas tus necesidades tecnológicas</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="text-blue-600 mb-4">{service.icon}</div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Me Section */}
      <section id="sobre-mi" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Sobre Mí</h2>
              <p className="text-lg text-gray-600 mb-6">
                Soy un técnico especializado en servicios de tecnología con más de 10 años de experiencia en el sector.
                Mi pasión es ayudar a las personas y empresas a mantener sus equipos funcionando de manera óptima.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Me especializo en mantenimiento preventivo y correctivo, instalación de hardware de última generación y
                implementación de soluciones de backup confiables para proteger la información más valiosa de mis
                clientes.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Certificado en Hardware</Badge>
                <Badge variant="secondary">Especialista en Backup</Badge>
                <Badge variant="secondary">10+ Años de Experiencia</Badge>
                <Badge variant="secondary">Soporte 24/7</Badge>
              </div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">¿Por qué elegirme?</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Diagnóstico gratuito</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Garantía en todos los servicios</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Atención personalizada</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Precios competitivos</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Servicio a domicilio disponible</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Lo que dicen mis clientes</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">"{testimonial.text}"</p>
                  <p className="font-semibold text-gray-900">- {testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">¿Listo para mejorar tu tecnología?</h2>
          <p className="text-xl text-blue-100 mb-8">Contáctame hoy mismo para una consulta gratuita</p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <Phone className="h-8 w-8 text-blue-200 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Teléfono</h3>
              <p className="text-blue-100">+57 321 730 77 03</p>
            </div>
            <div className="text-center">
              <Mail className="h-8 w-8 text-blue-200 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Email</h3>
              <p className="text-blue-100">oscar.jaramillo@unicatolica.edu.co</p>
            </div>
            <div className="text-center">
              <MapPin className="h-8 w-8 text-blue-200 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Ubicación</h3>
              <p className="text-blue-100">cali, colombia</p>
            </div>
          </div>

          <Button size="lg" onClick={handleWhatsAppContact} className="bg-green-600 hover:bg-green-700 text-white">
            <MessageCircle className="mr-2 h-5 w-5" />
            Contactar por WhatsApp
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Monitor className="h-6 w-6 text-blue-400" />
            <span className="text-xl font-bold">TechServices</span>
          </div>
          <p className="text-gray-400">© 2024 TechServices. Todos los derechos reservados.</p>
        </div>
      </footer>

      {/* Chat Bot */}
      {showChat && <ChatBot onClose={() => setShowChat(false)} />}
      <MaintenanceForm open={showMaintenanceForm} onClose={() => setShowMaintenanceForm(false)} />

      {/* Floating Chat Button */}
      {!showChat && (
        <Button
          onClick={() => setShowChat(true)}
          className="fixed bottom-6 right-6 rounded-full w-14 h-14 bg-blue-600 hover:bg-blue-700 shadow-lg"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  )
}
