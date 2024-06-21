const nodemailer = require("nodemailer");
require("dotenv").config();

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendActivationMail(to, link) {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject: "Activate account on " + process.env.API_URL,
        text: "Please follow the link to activate",
        html: `
        <div>
            <h1>Please follow the link to activate</h1>
            <a href="${link}">${link}</a>
        </div>
      `,
      });
    } catch (e) {
      return res.status(500).json("Error in sendMail " + e.message);
    }
  }

  async sendChangePassword(to, link) {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject: "Смяна на парола " + process.env.API_URL,
        text: "За да възстановите паролата си, моля, последвайте този линк. Ако това не сте вие, моля, игнорирайте това съобщение.",
        html: `
        <div>
            <h1 style="margin-bottom: 6rem">Моля, последвайте връзката, за да възстановите паролата си.</h1>
            <a href="${link}">${link}</a>
        </div>
      `,
      });
    } catch (e) {
      return res.status(500).json("Error in sendMail " + e.message);
    }
  }
}

module.exports = new MailService();
