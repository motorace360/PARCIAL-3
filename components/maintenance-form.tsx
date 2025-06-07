import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function MaintenanceForm({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.target as HTMLFormElement)
    const message = `
      Nuevo agendamiento:
      Nombre: ${formData.get('name')}
      Email: ${formData.get('email')}
      Teléfono: ${formData.get('phone')}
      Servicio: ${formData.get('service')}
      Fecha preferida: ${formData.get('preferredDate')}
      Descripción: ${formData.get('description')}
    `

    try {
      const phoneNumber = "3217307703"
      window.open(
        `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
        '_blank'
      )
      onClose()
    } catch (error) {
      alert('Error al enviar el formulario')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agendar Mantenimiento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="name" placeholder="Nombre completo" required />
          <Input name="email" type="email" placeholder="Email" required />
          <Input name="phone" placeholder="Teléfono" required />
          <select name="service" className="w-full p-2 border rounded" required>
            <option value="">Seleccione un servicio</option>
            <option value="Mantenimiento Preventivo">Mantenimiento Preventivo</option>
            <option value="Reparación">Reparación</option>
            <option value="Diagnóstico">Diagnóstico</option>
          </select>
          <Input 
            name="preferredDate" 
            type="text" 
            placeholder="Fecha y hora preferida" 
            required 
          />
          <Textarea 
            name="description" 
            placeholder="Describe el problema o servicio que necesitas" 
            required
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Enviando...' : 'Solicitar Cita'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
