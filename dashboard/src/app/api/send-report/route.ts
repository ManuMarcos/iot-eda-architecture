import { NextRequest, NextResponse } from "next/server";
import nodemailer from 'nodemailer';
import puppeteer from 'puppeteer';

export async function POST(request: NextRequest) {

    const { email } = await request.json();

    if (!email) {
        return NextResponse.json(
        { error: "Email es requerido" },
        { status: 400 }
      );
    }

  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  // Puppeteer toma captura del dashboard
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
    
    await page.goto("http://localhost:3000/dashboard", { waitUntil: "networkidle0" });
  await page.waitForSelector("#dashboard-content", { timeout: 30000 });

    const screenshotBuffer = Buffer.from(await page.screenshot({ fullPage: true }));
  await browser.close();

  const info = await transporter.sendMail({
    from: '"Demo" <no-reply@example.com>',
    to: email,
    subject: "Reporte de Sensores La Rinconada",
    text: "Dashboard informativo de sensores en La Rinconada y tus sedes.",
    attachments: [
      {
        filename: "dashboard.png",
        content: screenshotBuffer,
      },
    ],
  });

  // URL para ver el email en Ethereal
  const previewUrl = nodemailer.getTestMessageUrl(info);

  return new Response(JSON.stringify({ ok: true, previewUrl }), { status: 200 });
}
