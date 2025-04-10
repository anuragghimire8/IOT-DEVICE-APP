const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: 'gmail',  // Use Gmail's built-in SMTP service
  auth: {
    user: process.env.EMAIL,  // Your Gmail email address
    pass: process.env.APP_PASSWORD,  // Your Gmail App Password
  },
});

const sendEmailNotification = async (email, temperature, status, humidity = null) => {
  try {
    // Update the email content to include more information
    const subject = `Football Stadium Conditions Update: ${status}`;
    let content = `
      <h2>Stadium Conditions Update</h2>
      <p><strong>Status:</strong> ${status}</p>
      <p><strong>Temperature:</strong> ${temperature}°C</p>
    `;
    
    // Add humidity if available
    if (humidity !== null) {
      content += `<p><strong>Humidity:</strong> ${humidity}%</p>`;
    }
    
    content += `
      <p>Please check the stadium management system for more details.</p>
      <p>This is an automated notification.</p>
    `;
    
    // Define mailOptions with the subject and content
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: subject,
      html: content
    };
    
    // Send the email with the updated content
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);  // Log the sent message ID
    
    return true;
  } catch (error) {
    console.error("Error sending email notification:", error);
    throw error;
  }
};

module.exports = sendEmailNotification;
