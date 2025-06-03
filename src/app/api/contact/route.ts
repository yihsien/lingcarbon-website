import type { NextRequest } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  const { firstName, lastName, email, phoneNumber, message } = await req.json();

  const text = `
New contact enquiry from LingCarbon website
------------------------------------------
Name : ${firstName} ${lastName}
Email: ${email}
Phone: ${phoneNumber}

Message:
${message}
`;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: +(process.env.SMTP_PORT ?? 587),
    secure: false,                       // true if you later switch to 465
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.verify();          // optional diagnostics
    await transporter.sendMail({
      from: `"LingCarbon Website" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_TO_EMAIL,
      subject: 'New Website Contact',
      text,
    });
    return new Response('ok');
  } catch (err) {
    console.error('❌ mailer error:', err);
    return new Response('error', { status: 500 });
  }
}