import fs from 'fs';
import puppeteer from 'puppeteer';
import Handlebars from 'handlebars';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';

export async function generateCertificatePDF({
  recipientName,
  courseName,
  issuerLogoUrl,
  signatureUrl,
  issuedAt,
  certNumber,
  verifierUrl
}) {
  const templateHtml = fs.readFileSync('../templates/cert.html', 'utf8');
  const template = Handlebars.compile(templateHtml);

  const qrBase64 = await QRCode.toDataURL(verifierUrl);

  const html = template({
    recipient_name: recipientName,
    course_name: courseName,
    date: issuedAt.toLocaleDateString(),
    issuer_logo_url: issuerLogoUrl,
    signature_url: signatureUrl,
    qr_base64: qrBase64.split(',')[1],
  });

  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });

  const pdfBuffer = await page.pdf({
    format: 'A4',
    landscape: true,
    printBackground: true,
    margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' },
  });

  await browser.close();

  const filename = `certificates/${certNumber}.pdf`;
  fs.writeFileSync(`/tmp/${certNumber}.pdf`, pdfBuffer);

  // TODO: Upload to S3 / MinIO if needed
  return { filename, buffer: pdfBuffer, path: `/tmp/${certNumber}.pdf` };
}
