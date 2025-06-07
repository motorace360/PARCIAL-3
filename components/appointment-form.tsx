import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { format } from 'date-fns'
import es from 'date-fns/locale/es'
import dynamic from 'next/dynamic'

const DatePicker = dynamic(() => import('react-datepicker'), {
  ssr: false,
})

import "react-datepicker/dist/react-datepicker.css"

export function AppointmentForm({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [loading, setLoading] = useState(false)
  const [date, setDate] = useState<Date | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.target as HTMLFormElement)
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      date: date ? format(date, 'yyyy-MM-dd HH:mm:ss') : null,
      service: formData.get('service')
    }

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (res.ok) {
        onClose()
        alert('Cita agendada con éxito')
      }
    } catch (error) {
      alert('Error al agendar la cita')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agendar Mantenimiento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="name" placeholder="Nombre completo" required />
          <Input name="email" type="email" placeholder="Email" required />
          <Input name="phone" placeholder="Teléfono" required />
          <select name="service" className="w-full p-2 border rounded" required>
            <option value="">Seleccione un servicio</option>
            <option value="mantenimiento">Mantenimiento preventivo</option>
            <option value="reparacion">Reparación</option>
            <option value="diagnostico">Diagnóstico</option>
          </select>
          <DatePicker
            selected={date}
            onChange={(date) => setDate(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={60}
            dateFormat="MMMM d, yyyy h:mm aa"
            locale={es}
            placeholderText="Seleccione fecha y hora"
            className="w-full p-2 border rounded"
            minDate={new Date()}
            required
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Agendando...' : 'Agendar Cita'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
