"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Send, Bot, User } from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

interface ChatBotProps {
  onClose: () => void
}

export default function ChatBot({ onClose }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "¡Hola! Soy oscar Jaramillo. ¿En qué puedo ayudarte hoy? Puedo responder preguntas sobre nuestros servicios de mantenimiento, hardware y backup.",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const predefinedResponses: Record<string, string> = {
    mantenimiento:
      "Ofrezco servicios completos de mantenimiento que incluyen limpieza interna y externa, optimización del sistema, diagnóstico de problemas y actualización de drivers. ¿Te interesa agendar una cita?",
    hardware:
      "Instalo y vendo componentes como memoria RAM, discos duros SSD/HDD, tarjetas gráficas, procesadores y motherboards. Todos con garantía. ¿Qué componente necesitas?",
    backup:
      "Ofrezco soluciones de backup automático, recuperación de datos, almacenamiento en la nube y copias de seguridad locales. Tu información estará siempre protegida.",
    precio:
      "Los precios varían según el servicio. Ofrezco diagnóstico gratuito y presupuestos sin compromiso. ¿Qué servicio específico te interesa?",
    contacto:
      "Puedes contactarme por WhatsApp haciendo clic en el botón verde, o llamarme al +57 123 456 7890. También puedes escribir a contacto@techservices.com",
    horario:
      "Atiendo de lunes a sábado de 8:00 AM a 6:00 PM. También ofrezco servicio de emergencia 24/7 para casos urgentes.",
    garantia:
      "Todos mis servicios incluyen garantía. Para mantenimiento: 30 días, para instalación de hardware: 90 días, y para servicios de backup: soporte continuo.",
    domicilio:
      "Sí, ofrezco servicio a domicilio en toda la ciudad. El costo del desplazamiento se incluye en el presupuesto final.",
  }

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()

    for (const [keyword, response] of Object.entries(predefinedResponses)) {
      if (message.includes(keyword)) {
        return response
      }
    }

    if (message.includes("hola") || message.includes("buenos") || message.includes("buenas")) {
      return "¡Hola! ¿En qué puedo ayudarte? Puedo contarte sobre mantenimiento de computadores, instalación de hardware, servicios de backup, precios y más."
    }

    if (message.includes("gracias")) {
      return "¡De nada! ¿Hay algo más en lo que pueda ayudarte? Estoy aquí para resolver todas tus dudas sobre nuestros servicios."
    }

    return "Entiendo tu consulta. Te puedo ayudar con información sobre mantenimiento de computadores, instalación de hardware, servicios de backup, precios y contacto. ¿Sobre qué te gustaría saber más?"
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputValue),
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botResponse])
      setIsLoading(false)
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md h-[600px] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-blue-600" />
            <span>Asistente Virtual</span>
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col space-y-4">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.sender === "bot" && <Bot className="h-4 w-4 mt-0.5 text-blue-600" />}
                      {message.sender === "user" && <User className="h-4 w-4 mt-0.5 text-white" />}
                      <p className="text-sm">{message.text}</p>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-4 w-4 text-blue-600" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje..."
              disabled={isLoading}
            />
            <Button onClick={handleSendMessage} disabled={isLoading || !inputValue.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
