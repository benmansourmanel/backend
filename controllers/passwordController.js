import { sendMail } from '../mailer.js'; // Correct path for mailer
import User from '../models/user.js'; // Correct path for user model
import SecretCode from '../models/secretCode.js'; // Correct path for secretCode model
import bcrypt from 'bcrypt';

// Example: send password reset code
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a 5-digit numeric code
    const code = Math.floor(10000 + Math.random() * 90000).toString();
    const expirationDate = new Date(Date.now() + 3600000); // 1 hour expiry

    // Save the secret code in the database
    const secretCode = new SecretCode({
      code,
      expirationDate,
      email // Store email with the code
    });
    await secretCode.save();

    // Send the email with the reset code
    await sendMail(
      email,
      'Password Reset Code',
      `Your password reset code is: ${code}`,
      `<p>Your password reset code is: <strong>${code}</strong></p>`
    );

    // Respond to the request
    res.status(200).json({ message: 'Reset code sent to email' });
  } catch (err) {
    console.error('Error in forgotPassword function:', err);
    res.status(500).json({ message: 'Error sending reset code', error: err.message });
  }
};



export const verifyCode = async (req, res) => {
  const { email, code } = req.body; // Get email and code from request body
  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the secret code associated with the user
    const secretCode = await SecretCode.findOne({ code });
    if (!secretCode) {
      return res.status(400).json({ message: 'Invalid code' });
    }

    // Check if the code is expired
    if (secretCode.expirationDate < new Date()) {
      return res.status(400).json({ message: 'Code expired' });
    }

    // Code is valid and not expired
    res.status(200).json({ message: 'Code verified successfully' });

  } catch (err) {
    console.error('Error in verifyCode function:', err);
    res.status(500).json({ message: 'Error verifying code', error: err.message });
  }
};

export const resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body; // Get email, code, and newPassword from request body

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the secret code associated with the user
    const secretCode = await SecretCode.findOne({ code });
    if (!secretCode) {
      return res.status(400).json({ message: 'Invalid code' });
    }

    // Check if the code is expired
    if (secretCode.expirationDate < new Date()) {
      return res.status(400).json({ message: 'Code expired' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    // Optionally, remove the used code
    await SecretCode.deleteOne({ code });

    // Respond to the request
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Error in resetPassword function:', err);
    res.status(500).json({ message: 'Error updating password', error: err.message });
  }
};