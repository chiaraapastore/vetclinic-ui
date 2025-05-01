import jsPDF from 'jspdf';

export function generaFatturaPDF(app: any): void {
  const doc = new jsPDF();

  const issueDate = new Date(app.appointmentDate || Date.now()).toLocaleDateString();
  const total = Number(app.amount) || 0;

  const cliente = app.cliente || {};
  const clienteFirstName = typeof cliente.firstName === 'string' ? cliente.firstName : '';
  const clienteLastName = typeof cliente.lastName === 'string' ? cliente.lastName : '';
  const clienteEmail = typeof cliente.email === 'string' ? cliente.email : '';

  const animal = app.animal || {};
  const animalName = typeof animal.name === 'string' ? animal.name : '';

  const metodo = typeof app.metodo === 'string' ? app.metodo : '-';
  const cardType = typeof app.cardType === 'string' ? app.cardType : '';

  const appointmentId = typeof app.id === 'number' || typeof app.id === 'string' ? app.id : '0000';

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('VetEnterprise Solutions', 14, 20);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('P.IVA 01234567890', 14, 26);


  doc.setFont('helvetica', 'bold');
  doc.text('FATTURA', 160, 20);
  doc.setFont('helvetica', 'normal');
  doc.text(`Data Fattura: ${issueDate}`, 140, 30);
  doc.text(`Numero: FAT-${appointmentId}`, 140, 36);


  doc.setLineWidth(0.5);
  doc.line(14, 42, 196, 42);


  doc.setFont('helvetica', 'bold');
  doc.text('Fatturare a:', 14, 52);
  doc.setFont('helvetica', 'normal');
  doc.text(`${clienteFirstName} ${clienteLastName}`, 14, 58);
  doc.text(clienteEmail, 14, 64);

  doc.setFont('helvetica', 'bold');
  doc.text('Descrizione', 14, 80);
  doc.text('Prezzo', 170, 80);
  doc.setFont('helvetica', 'normal');
  doc.text(`Visita veterinaria per: ${animalName} (${app.reason})`, 14, 92);
  doc.text(`€${total.toFixed(2)}`, 170, 88);

  doc.setFont('helvetica', 'bold');
  doc.text('Metodo di Pagamento:', 14, 105);
  doc.setFont('helvetica', 'normal');
  doc.text(metodo, 65, 105);

  if (metodo === 'Carta' && cardType !== '') {
    doc.setFont('helvetica', 'bold');
    doc.text('Tipo Carta:', 14, 112);
    doc.setFont('helvetica', 'normal');
    doc.text(cardType, 65, 112);
  }

  const tax = total * 0.22;
  const grandTotal = total + tax;

  doc.setFont('helvetica', 'bold');
  doc.text('IVA (22%)', 160, 125, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.text(`€${tax.toFixed(2)}`, 196, 125, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.text('Totale', 160, 132, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.text(`€${grandTotal.toFixed(2)}`, 196, 132, { align: 'right' });

  doc.setFontSize(10);
  doc.text('Pagamento da effettuare entro 15 giorni dalla data di emissione.', 14, 150);
  doc.text('Grazie per aver scelto VetEnterprise Solutions!', 14, 157);

  doc.save(`Fattura_Appuntamento_${appointmentId}.pdf`);
}
