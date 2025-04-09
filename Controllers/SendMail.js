const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: 'gmail',  // Use Gmail's built-in SMTP service
  auth: {
    user: process.env.EMAIL,  // Your Gmail email address
    pass: process.env.APP_PASSWORD,  // Your Gmail App Password
  },
});
const sendEmailNotification = async (userEmail, temperature, status) => {
  const mailOptions = {
    from: `"IOR System 👻" <${process.env.EMAIL}>`, // Sender address
    to: userEmail,  // Recipient email
    subject: `Alert: ${status}`, // Subject using status
    html: `<p>The temperature is : <strong>${temperature}°C</strong></p>
           <p>Status: <strong>${status}</strong></p>`, // Body with status and temperature
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);  // Log the sent message ID
  } catch (error) {
    console.error("Error sending email:", error);  // Log any error
  }
};


module.exports = sendEmailNotification;
