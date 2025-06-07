import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { RateLimiter } from "@/lib/rate-limiter";
import clientPromise from "@/lib/mongodb";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const rateLimiter = new RateLimiter();
const responseCache = new Map<string, string>();

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function tryGeminiWithRetry(message: string, maxRetries = 3): Promise<string> {
  const cacheKey = message.toLowerCase().trim();
  if (responseCache.has(cacheKey)) {
    return responseCache.get(cacheKey)!;
  }

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    if (await rateLimiter.tryConsume()) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(message);
        const text = result.response.text();
        responseCache.set(cacheKey, text);
        return text;
      } catch (error: any) {
        if (error?.status === 429 && attempt < maxRetries - 1) {
          await delay(Math.pow(2, attempt) * 1000);
          continue;
        }
        throw error;
      }
    }
    await delay(1000);
  }
  throw new Error("Rate limit exceeded");
}

const fallbackResponses = {
  mantenimiento: "Ofrezco servicios completos de mantenimiento que incluyen limpieza, optimización y actualizaciones.",
  hardware: "Instalo y vendo componentes como RAM, discos duros y más. ¿Qué necesitas?",
  backup: "Ofrezco servicios de respaldo y recuperación de datos.",
  precio: "Los precios varían según el servicio. El diagnóstico es gratuito.",
  default: "En este momento el servicio está ocupado. ¿Podrías ser más específico sobre qué necesitas?"
};

const systemPrompt = `Eres Oscar Jaramillo, un apasionado técnico de computadoras con más de 10 años de experiencia.
Tu personalidad:
- Eres amable, paciente y explicas todo de manera clara y sencilla
- Te apasiona la tecnología y ayudar a las personas con sus problemas técnicos
- Usas un tono conversacional y cercano, pero mantienes el profesionalismo
- Incluyes emojis ocasionalmente para dar calidez a tus respuestas
- Siempre ofreces soluciones prácticas y consejos útiles

Tus servicios principales:
1. Mantenimiento de Computadoras:
   - Limpieza profesional de hardware
   - Optimización de software y sistema operativo
   - Eliminación de virus y malware
   - Actualizaciones de controladores y software

2. Servicios de Hardware:
   - Instalación y actualización de componentes
   - Venta de hardware con garantía
   - Diagnóstico y reparación de fallas
   - Asesoría en mejoras de rendimiento

3. Servicios de Backup:
   - Respaldo en la nube y local
   - Recuperación de datos perdidos
   - Configuración de copias automáticas
   - Protección contra pérdida de información

4. Precios y Atención:
   - Diagnóstico inicial gratuito
   - Presupuestos sin compromiso
   - Garantía en todos los servicios
   - Atención personalizada

Cuando te pregunten sobre estos temas, responde de manera entusiasta y detallada, siempre orientado a ayudar y solucionar problemas. Ofrece ejemplos específicos y recomienda servicios adicionales relacionados cuando sea apropiado.

Si no entiendes algo, pide amablemente más detalles para poder ayudar mejor.

Ejemplo de respuestas:
- Sobre mantenimiento: "¡Me encantaría ayudarte con el mantenimiento de tu equipo! 💻 Ofrezco un servicio completo que incluye limpieza profesional, optimización del sistema y actualización de software. ¿Has notado algún problema específico últimamente?"

- Sobre hardware: "¡Excelente pregunta sobre hardware! 🔧 Trabajo con componentes de las mejores marcas y todos incluyen garantía. ¿Qué tipo de uso le das a tu computadora? Así podré recomendarte los componentes más adecuados."

- Sobre backup: "¡La seguridad de tus datos es crucial! 🔒 Puedo ayudarte a implementar un sistema de respaldo que proteja tu información tanto en la nube como localmente. ¿Qué tipo de datos necesitas proteger?"

- Sobre precios: "Entiendo tu interés en los precios. 👍 Ofrezco diferentes opciones según tus necesidades, y el diagnóstico inicial es totalmente gratuito. ¿Te gustaría que revisemos tu equipo para darte un presupuesto detallado?"

Mantén este estilo de comunicación en todas tus respuestas.`;

export async function POST(req: Request) {
  try {
    const { message, chatId } = await req.json();
    let responseText: string;

    try {
      responseText = await tryGeminiWithRetry(message);
    } catch (error) {
      console.error("AI Service error:", error);
      responseText = Object.entries(fallbackResponses).find(
        ([key]) => message.toLowerCase().includes(key)
      )?.[1] || fallbackResponses.default;
    }

    // Store in MongoDB
    try {
      const client = await clientPromise;
      const db = client.db("chatbot");
      await db.collection("chats").updateOne(
        { chatId },
        {
          $push: {
            messages: {
              $each: [
                { text: message, sender: "user", timestamp: new Date() },
                { text: responseText, sender: "bot", timestamp: new Date() }
              ]
            }
          }
        },
        { upsert: true }
      );
    } catch (dbError) {
      console.error("Database error:", dbError);
    }

    return NextResponse.json({ text: responseText });
  } catch (error) {
    console.error("General error:", error);
    return NextResponse.json(
      { text: fallbackResponses.default },
      { status: 200 }
    );
  }
}
