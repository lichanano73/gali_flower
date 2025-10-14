import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,   // ej: smtp.gmail.com
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendWelcomeEmail = async (to: string, name: string) => {
  const info = await transporter.sendMail({
    from: `"Mi App" <${process.env.SMTP_USER}>`,
    to,
    subject: "¡Bienvenido a la plataforma!",
    html: `
      <h2>Hola ${name},</h2>
      <p>Tu cuenta fue creada correctamente 🚀</p>
      <p>Ya podés ingresar y empezar a usar la plataforma.</p>
    `,
  });

  console.log("Mensaje enviado: %s", info.messageId);
};
