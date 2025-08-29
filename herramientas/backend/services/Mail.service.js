import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Debug para verificar variables
console.log("MAIL_USER:", process.env.MAIL_USER);
console.log("MAIL_PASS:", process.env.MAIL_PASS ? "OK" : "MISSING");

// Configuración manual de Gmail
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, // usa 465 con secure true
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Verificar conexión SMTP
transporter
  .verify()
  .then(() => console.log("✅ Conexión SMTP lista"))
  .catch((err) => console.error("❌ Error de conexión SMTP:", err));

async function enviarMail(to, subject, text) {
  try {
    const info = await transporter.sendMail({
      from: `"Sistema Pedidos" <${process.env.MAIL_USER}>`,
      to,
      subject,
      text,
    });
    console.log("📧 Mail enviado:", info.messageId);
    return { success: true, info };
  } catch (error) {
    console.error("❌ Error enviando mail:", error);
    return { success: false, error };
  }
}

export default {
  enviarMail,
};
