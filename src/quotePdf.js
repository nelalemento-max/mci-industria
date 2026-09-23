import { jsPDF } from 'jspdf'

const money = (value) => `Bs ${Number(value || 0).toFixed(2)}`

export function downloadQuotePdf(quote) {
  const pdf = new jsPDF({unit:'mm', format:'a4'})
  const margin = 16
  pdf.setFillColor(9, 41, 67)
  pdf.rect(0, 0, 210, 35, 'F')
  pdf.setTextColor(255, 255, 255)
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(21)
  pdf.text('MCI', margin, 16)
  pdf.setFontSize(11)
  pdf.text('Mantenimiento Corporativo Industrial', margin, 24)
  pdf.setFontSize(9)
  pdf.text('COTIZACIÓN', 194, 16, {align:'right'})
  pdf.text(quote.number || `MCI-${Date.now()}`, 194, 23, {align:'right'})

  pdf.setTextColor(23, 35, 52)
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  pdf.text(`Cliente: ${quote.clientName || ''}`, margin, 47)
  pdf.text(`WhatsApp: ${quote.clientPhone || ''}`, margin, 54)
  pdf.text(`Correo: ${quote.clientEmail || ''}`, margin, 61)
  pdf.text(`Fecha: ${new Date().toLocaleDateString('es-BO')}`, 194, 47, {align:'right'})

  let y = 74
  pdf.setFillColor(232, 244, 244)
  pdf.rect(margin, y - 6, 178, 9, 'F')
  pdf.setFont('helvetica', 'bold')
  pdf.text('Descripción', margin + 2, y)
  pdf.text('Cant.', 125, y)
  pdf.text('P. unitario', 145, y)
  pdf.text('Subtotal', 191, y, {align:'right'})
  y += 9
  pdf.setFont('helvetica', 'normal')
  quote.items.forEach((item) => {
    if (y > 260) { pdf.addPage(); y = 20 }
    const lines = pdf.splitTextToSize(`${item.description}${item.specs ? `\n${item.specs}` : ''}`, 100)
    pdf.text(lines, margin + 2, y)
    pdf.text(String(item.qty), 128, y)
    pdf.text(money(item.unitPrice), 145, y)
    pdf.text(money(item.qty * item.unitPrice), 191, y, {align:'right'})
    y += Math.max(12, lines.length * 5 + 4)
    pdf.setDrawColor(220, 228, 233)
    pdf.line(margin, y - 5, 194, y - 5)
  })
  const total = quote.items.reduce((sum, item) => sum + Number(item.qty || 0) * Number(item.unitPrice || 0), 0)
  y += 4
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(13)
  pdf.text(`TOTAL: ${money(total)}`, 194, y, {align:'right'})
  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'normal')
  pdf.text(pdf.splitTextToSize(quote.notes || 'Precios y disponibilidad sujetos a confirmación. Cotización válida por el plazo indicado por MCI.', 175), margin, y + 15)
  pdf.setTextColor(90, 105, 116)
  pdf.text('Av. Centenario, calle 3 N.º 3020 - Santa Cruz | WhatsApp 67778452', 105, 287, {align:'center'})
  pdf.save(`${quote.number || 'Cotizacion-MCI'}.pdf`)
}
