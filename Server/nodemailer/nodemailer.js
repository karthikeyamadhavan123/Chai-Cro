const nodemailer = require("nodemailer");
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // Gmail SMTP server
    port: 587, // Port for TLS/STARTTLS
    secure: false, // false for TLS/STARTTLS, true for SSL (port 465)
    auth: {
        user: process.env.NODEMAILER_EMAIL, // your email from environment variables
        pass: process.env.NODEMAILER_PASS, // your app password from environment variables
    },
});

async function welcomeEmail(email) {
    try {
        const info = await transporter.sendMail({
            from: process.env.NODEMAILER_EMAIL, // sender address
            to: email, // receiver address
            subject: "Welcome to Chaicro!",
            text: `Welcome to Chaicro! We're excited to have you on board.`, // plain text body
            html: `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Chaicro!</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
      <h1 style="color: white; margin: 0;">Welcome to Chaicro!</h1>
    </div>
    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
      <p>Hello,</p>
      <p>Thank you for signing up! We're thrilled to have you as a part of our community.</p>
      <p>To get started, visit our website and explore the features available to you:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.CLIENT_URL}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Visit Chaicro</a>
      </div>
      <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
      <p>Best regards,<br>Your Chaicro Team</p>
    </div>
    <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
      <p>This is an automated message, please do not reply to this email.</p>
    </div>
  </body>
  </html>`
        });
        return info;

    } catch (error) {
        console.error("Error sending email: ", error);
    }
}


async function sendVerificationEmail(email, token) {
  try {
    const info = await transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL, // sender address
      to: email, // receiver address
      subject: 'Password Reset', // Subject line
      text: `You requested a password reset. Use this token to reset your password: ${token}`, // plain text body
      html: `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Password Reset</h1>
        </div>
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
          <p>Hello,</p>
          <p>We received a request to reset your password. If you didn't make this request, please ignore this email.</p>
          <p>To reset your password, click the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL}/api/reset-password/${token}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
          </div>
          <p>This link will expire in 1 hour for security reasons.</p>
          <p>Best regards,<br>Your App Team</p>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
          <p>This is an automated message, please do not reply to this email.</p>
        </div>
      </body>
      </html>
      `
    });
    return info;

  } catch (error) {
    console.error("Error sending email: ", error);
  }
}


async function sendResetEmailSuccessful(email) {
  try {
    const info = await transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL, // sender address
      to: email, // receiver address
      subject: 'Password Reset Successful', // Subject line
      text: `Congrats. Your password has been reset`, // plain text body
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Successful</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Password Reset Successful</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>We're writing to confirm that your password has been successfully reset.</p>
    <div style="text-align: center; margin: 30px 0;">
      <div style="background-color: #4CAF50; color: white; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; display: inline-block; font-size: 30px;">
        ✓
      </div>
    </div>
    <p>If you did not initiate this password reset, please contact our support team immediately.</p>
    <p>For security reasons, we recommend that you:</p>
    <ul>
      <li>Use a strong, unique password</li>
      <li>Enable two-factor authentication if available</li>
      <li>Avoid using the same password across multiple sites</li>
    </ul>
    <p>Thank you for helping us keep your account secure.</p>
    <p>Best regards,<br>Your App Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`
    });

    console.log("Email sent successfully:");

  } catch (error) {
    console.error("Error sending email:", error);
  }
}

async function sendShopCreationEmail(email, shopName) {
  try {
    const info = await transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: 'Congratulations! Your Shop Has Been Created',
      text: `Congratulations! Your shop "${shopName}" has been successfully created.`,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Shop Creation Successful</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Shop Creation Successful</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>We're excited to inform you that your shop "${shopName}" has been successfully created!</p>
    <div style="text-align: center; margin: 30px 0;">
      <div style="background-color: #4CAF50; color: white; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; display: inline-block; font-size: 30px;">
        🏪
      </div>
    </div>
    <p>Here are some next steps to get you started:</p>
    <ul>
      <li>Customize your shop's appearance</li>
      <li>Add products to your inventory</li>
      <li>Set up your payment methods</li>
      <li>Share your shop link on social media</li>
    </ul>
    <p>If you need any assistance, don't hesitate to reach out to our support team.</p>
    <p>Best of luck with your new shop!</p>
    <p>Best regards,<br>Your ChaiCro  Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`
    });

    console.log("Shop creation email sent successfully:");

  } catch (error) {
    console.error("Error sending shop creation email:", error);
  }
}
async function sendProductCreationEmail(email, productName) {
  try {
    const info = await transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: 'New Product Added Successfully',
      text: `Your new product "${productName}" has been successfully added to your shop.`,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Product Added Successfully</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #3498db, #2980b9); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Product Added Successfully</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>Great news! Your new product "${productName}" has been successfully added to your shop.</p>
    <div style="text-align: center; margin: 30px 0;">
      <div style="background-color: #3498db; color: white; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; display: inline-block; font-size: 30px;">
        📦
      </div>
    </div>
    <p>Here are some things you might want to do next:</p>
    <ul>
      <li>Double-check the product details and pricing</li>
      <li>Add more high-quality images if needed</li>
      <li>Create a special promotion for your new product</li>
      <li>Share the product on your social media channels</li>
    </ul>
    <p>Remember, you can always edit your product details from your shop dashboard.</p>
    <p>Happy selling!</p>
    <p>Best regards,<br>Your E-ChaiCro  Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`
    });

    console.log("Product creation email sent successfully:");

  } catch (error) {
    console.error("Error sending product creation email:", error);
  }
}

async function sendAccountDeletionEmail(email, username) {
  try {
    const info = await transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: 'Your Account Has Been Deleted',
      text: `Dear ${username}, your account has been successfully deleted. We're sorry to see you go.`,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Account Deleted</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #e74c3c, #c0392b); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Account Deleted</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Dear ${username},</p>
    <p>We're writing to confirm that your account has been successfully deleted as per your request.</p>
    <div style="text-align: center; margin: 30px 0;">
      <div style="background-color: #e74c3c; color: white; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; display: inline-block; font-size: 30px;">
        ✓
      </div>
    </div>
    <p>We're sorry to see you go. Here's what you need to know:</p>
    <ul>
      <li>Your personal information has been removed from our systems</li>
      <li>Any remaining account balance has been refunded (if applicable)</li>
      <li>You will no longer receive emails from us, except for this confirmation</li>
    </ul>
    <p>If you deleted your account by mistake or change your mind, please contact our support team within 30 days, and we may be able to restore your account.</p>
    <p>We appreciate the time you spent with us and hope to see you again in the future.</p>
    <p>Best regards,<br>Your ChaiCro Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`
    });

    console.log("Account deletion email sent successfully:");

  } catch (error) {
    console.error("Error sending account deletion email:", error);
  }
}

// module.exports = { sendVerificationEmail, sendResetEmailSuccessful };
module.exports = { welcomeEmail ,sendVerificationEmail,sendResetEmailSuccessful,sendShopCreationEmail,sendProductCreationEmail,sendAccountDeletionEmail}