
import React, { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import QRCode from 'qrcode';

export default function ClienteQRForm() {
  const [form, setForm] = useState({ nombre: '', telefono: '', ubicacion: '' });
  const [foto, setFoto] = useState(null);
  const [generado, setGenerado] = useState(null);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const generarFicha = async () => {
    if (!form.nombre || !form.telefono || !form.ubicacion || !foto) return alert('Completá todos los datos.');

    const id = `${form.nombre.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;
    const folder = id;
    const zip = new JSZip();

    const html = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${form.nombre}</title>
<style>body{font-family:sans-serif;text-align:center;background:#f7f7f7;padding:20px}img{width:200px;height:200px;border-radius:100px;object-fit:cover}h1{margin-top:10px}a.btn{display:inline-block;margin:10px;padding:12px 20px;text-decoration:none;border-radius:6px;color:#fff}a.call{background:#4CAF50}a.wa{background:#25D366}a.loc{background:#007BFF}</style>
</head>
<body><img src="foto.jpg" alt="foto"><h1>${form.nombre}</h1><p>Hola, me perdí 🐾</p>
<a href="tel:${form.telefono}" class="btn call">Llamar</a>
<a href="https://wa.me/${form.telefono.replace('+','')}?text=Hola%2C%20encontr%C3%A9%20a%20${form.nombre}" class="btn wa">WhatsApp</a>
<a href="https://www.google.com/maps?q=${form.ubicacion.replace(/ /g,'+')}" class="btn loc">Ubicación</a>
</body></html>`;

    zip.file(`${folder}/index.html`, html);

    const reader = new FileReader();
    reader.onload = async e => {
      const base64 = e.target.result.split(',')[1];
      zip.file(`${folder}/foto.jpg`, base64, { base64: true });

      const urlQR = `https://TUSITIO.github.io/${folder}`;
      const qrData = await QRCode.toDataURL(urlQR);
      const qrBase64 = qrData.split(',')[1];
      zip.file(`${folder}/qr.png`, qrBase64, { base64: true });

      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, `ficha_${folder}.zip`);
      setGenerado(urlQR);
    };
    reader.readAsDataURL(foto);
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Formulario para tu Mascota</h2>
      <input name="nombre" onChange={handleChange} className="w-full border p-2 mb-2" placeholder="Nombre de la mascota" />
      <input name="telefono" onChange={handleChange} className="w-full border p-2 mb-2" placeholder="Teléfono con prefijo" />
      <input name="ubicacion" onChange={handleChange} className="w-full border p-2 mb-2" placeholder="Dirección o zona" />
      <input type="file" accept="image/*" onChange={e => setFoto(e.target.files[0])} className="mb-4" />
      <button onClick={generarFicha} className="bg-green-600 text-white px-4 py-2 rounded">Generar ficha + QR</button>
      {generado && (
        <p className="mt-4">Ficha generada: <a href={generado} target="_blank" className="text-blue-600 underline">{generado}</a></p>
      )}
    </div>
  );
}
