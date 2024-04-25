const emailVerification = (user, token) => {
  const verificationToken = `http://localhost:3000/auth/verify-email/${token}`;
  return `<div style="max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #dddddd; border-radius: 10px; color: #000000; background-color: #ffffff;">
    <h1 style="text-align: center;">Email Verification</h1>
    <p>Hello, ${user.name}</p>
    <p>Thank you for signing up with us. Please verify your email address by clicking the button below:</p>
    <a href="${verificationToken}" style="display: block; width: 200px; margin: 0 auto; padding: 10px 20px; background-color: #000000; color: #ffffff; text-align: center; text-decoration: none; border-radius: 5px;">Verify Email</a>
    <p>If the button above does not work, you can also copy and paste the following link into your browser:</p>
    <p><a href="${verificationToken}" style="color: #000000;">${verificationToken}</a></p>
    <p>Once your email is verified, you will have access to all our features.</p>
    <p>If you have any questions or need further assistance, please contact us at support@example.com.</p>
    <p>Thank you,</p>
    <p>The Mailer Team</p>
  </div>`;
};

module.exports = { emailVerification };
