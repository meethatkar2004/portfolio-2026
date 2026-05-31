'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendEmail(data: SendEmailData) {
  const { name, email, subject, message } = data;

  // Basic Server-Side Validation
  if (!name || !email || !subject || !message) {
    return { error: 'All fields are required.' };
  }

  try {
    const result = await resend.emails.send({
      from: 'Portfolio Contact Form <onboarding@resend.dev>', // Resend provides this test email
      to: 'meethatkar2004@gmail.com', // Recipient email address
      subject: `Portfolio Message: ${subject}`,
      replyTo: email,
      html: `
        <div style="font-family: sans-serif; padding: 25px; color: #2a1209; max-width: 600px; border: 1px solid rgba(36, 22, 0, 0.1); border-radius: 16px; background-color: #ffffeb;">
          <h2 style="color: #b99400; border-bottom: 2px solid rgba(185, 148, 0, 0.2); padding-bottom: 12px; font-family: 'Bebas Neue', Arial, sans-serif; font-size: 24px; letter-spacing: 1px; text-transform: uppercase;">NEW PORTFOLIO MESSAGE</h2>
          
          <div style="margin-top: 20px;">
            <p style="margin: 8px 0; font-size: 15px;"><strong>Sender Name:</strong> ${name}</p>
            <p style="margin: 8px 0; font-size: 15px;"><strong>Sender Email:</strong> <a href="mailto:${email}" style="color: #b99400; text-decoration: none; font-weight: bold;">${email}</a></p>
            <p style="margin: 8px 0; font-size: 15px;"><strong>Subject:</strong> ${subject}</p>
          </div>
          
          <div style="margin-top: 24px; padding: 18px; background-color: rgba(185, 148, 0, 0.05); border-left: 4px solid #b99400; border-radius: 8px;">
            <p style="margin: 0; white-space: pre-wrap; font-size: 14px; line-height: 1.6; color: #241600;">${message}</p>
          </div>
          
          <div style="margin-top: 24px; font-size: 11px; color: rgba(42, 18, 9, 0.5); text-align: center; border-top: 1px solid rgba(36, 22, 0, 0.05); padding-top: 12px;">
            Sent dynamically from your portfolio site
          </div>
        </div>
      `,
    });

    return { success: true, data: result };
  } catch (error: unknown) {
    console.error('Resend Action Error:', error);
    return { error: 'Failed to send email.' };
  }
}
