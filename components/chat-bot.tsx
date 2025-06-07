"use client"

import type React from "react"
import { useState, useEffect } from "react"
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

const fallbackResponses = {
  mantenimiento: "¡Hola! 💻 Ofrezco servicios completos de mantenimiento que incluyen limpieza, optimización y actualización de software. ¿Te gustaría agendar una revisión?",
  hardware: "¡Genial que preguntes por hardware! 🔧 Instalo y vendo componentes como RAM, discos duros, tarjetas gráficas y más. Todos con garantía. ¿Qué componente necesitas?",
  backup: "¡La seguridad de tus datos es importante! 🔒 Ofrezco servicios de respaldo en la nube y local, además de recuperación de datos. ¿Te gustaría proteger tu información?",
  precio: "¡Gracias por tu interés! 💰 Los precios varían según el servicio. El diagnóstico inicial es gratuito. ¿Sobre qué servicio quieres saber más?",
  hola: "¡Hola! 👋 ¡Me alegro de verte! Soy Oscar Jaramillo, tu especialista técnico. ¿En qué puedo ayudarte hoy?",
  "como estas": "¡Muy bien, gracias por preguntar! 😊 Listo para ayudarte con cualquier necesidad técnica que tengas. ¿En qué puedo asistirte?",
  "quien eres": "¡Hola! 👨‍💻 Soy Oscar Jaramillo, un técnico especializado en mantenimiento de computadores, instalación de hardware y servicios de backup. Tengo más de 10 años de experiencia ayudando a personas como tú con sus necesidades tecnológicas. ¿En qué puedo ayudarte hoy?",
  default: "¡Hola! 👋 Soy Oscar, tu técnico de confianza. Puedo ayudarte con mantenimiento de computadores, hardware, backup y más. ¿Qué te gustaría saber?",
};

export default function ChatBot({ onClose }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "¡Hola! 👨‍💻 Soy Oscar Jaramillo, especialista técnico con más de 10 años de experiencia. Me apasiona ayudar a las personas con sus necesidades tecnológicas. ¿En qué puedo asesorarte hoy? Especializado en:\n\n✨ Mantenimiento de computadores\n🔧 Instalación de hardware\n🔒 Servicios de backup\n💰 Precios accesibles",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [chatId] = useState(() => Date.now().toString())

  const getFallbackResponse = (message: string): string => {
    const lowercaseMessage = message.toLowerCase().trim();
    
    // Check for greetings and common questions first
    if (lowercaseMessage.includes("hola") || lowercaseMessage.includes("hey") || lowercaseMessage.includes("saludos")) {
      return fallbackResponses.hola;
    }
    if (lowercaseMessage.includes("como estas")) {
      return fallbackResponses["como estas"];
    }
    if (lowercaseMessage.includes("quien eres") || lowercaseMessage.includes("que eres")) {
      return fallbackResponses["quien eres"];
    }

    // Check for service-related keywords
    for (const [key, response] of Object.entries(fallbackResponses)) {
      if (lowercaseMessage.includes(key)) {
        return response;
      }
    }
    return fallbackResponses.default;
  };

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

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputValue,
          chatId,
        }),
      })

      if (!response.ok && response.status === 429) {
        const fallbackText = getFallbackResponse(inputValue);
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: fallbackText,
          sender: "bot",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botResponse])
        return;
      }

      const data = await response.json()
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: data.text || getFallbackResponse(inputValue),
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botResponse])
    } catch (error) {
      console.error("Error:", error)
      const fallbackText = getFallbackResponse(inputValue);
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: fallbackText,
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botResponse])
    } finally {
      setIsLoading(false)
    }
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
