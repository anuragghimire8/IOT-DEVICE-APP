const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: 'gmail',  // Use Gmail's built-in SMTP service
  auth: {
    user: process.env.EMAIL,  // Your Gmail email address
    pass: process.env.APP_PASSWORD,  // Your Gmail App Password
  },
});

const sendEmailNotification = async (email, temperature, status, humidity, air_quality = null) => {
  try {
    const subject = `Football Stadium Conditions Update: ${status}`;
    let content = `
    <h2>Dear Team <h2>
      <h2>Field Conditions Update</h2>
      <p><strong>Status:</strong> ${status}</p>
      <p><strong>Temperature:</strong> ${temperature}°C</p>
      <p><strong>Air Quality:</strong> ${air_quality}</p>
    `;

    if (humidity !== null) {
      content += `<p><strong>Humidity:</strong> ${humidity}%</p>`;
    }

    // Add custom messages based on game status
    if (status === "Game Allowed") {
      content += `
        <p>The current stadium conditions are suitable for a match. You may proceed as scheduled.</p>
      `;

    } else if (status === "Game Postponed (Unfavorable Conditions)") {
      content += `
        <p>The match is postponed due to unfavorable humidity conditions. Matches are only allowed when humidity is below 75%.</p>
        <p>Please monitor the conditions and plan a future match once conditions improve.</p>
      `;
    } else if (status === "Game Cancelled (High Humidity)") {
      content += `
        <p>The match is cancelled due to high humidity levels, which exceed the safety threshold.</p>
        <p>Please wait until humidity levels drop below 90% before scheduling another match.</p>
      `;
    } else if (status === "Game Forfeited (Extreme Temperature)") {
      content += `
        <p>The match cannot proceed due to extreme temperature conditions.</p>
        <p>Matches are only allowed when the temperature is between 0°C and 35°C.</p>
        <p>Please monitor the stadium conditions and reschedule accordingly.</p>
      `;
    }

    content += `
      <p>Please check the stadium management system for more details.</p>
   
    `;

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: subject,
      html: content
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);

    return true;
  } catch (error) {
    console.error("Error sending email notification:", error);
    throw error;
  }
};

module.exports = sendEmailNotification;
