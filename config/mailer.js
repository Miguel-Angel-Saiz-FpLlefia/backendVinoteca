const nodemailer = require("nodemailer");

const mailerEnabled = process.env.MAILER_ENABLED !== "false";

const transporter = mailerEnabled
  ? nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: Number(process.env.EMAIL_PORT || 587),
      secure: process.env.EMAIL_SECURE === "true",
      family: 4,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
        minVersion: "TLSv1.2",
      },
    })
  : null;

if (!transporter) {
  console.warn("Mailer desactivado temporalmente: MAILER_ENABLED=false");
}

module.exports = transporter;
