import dotenv from 'dotenv';
import { getUserByEmailAndPassword } from '../Models/User.js';
import { getUserByEmail } from '../Models/User.js';

import jwt from 'jsonwebtoken'; // Import jsonwebtoken
dotenv.config();
import bcrypt from 'bcryptjs'; // For password hashing
import { createUser } from '../Models/User.js'; // Assuming you have a function for user creation

export const registerUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Missing required parameters: username and password');
  }

  try {
    // Check if the user already exists
    const existingUser = await getUserByEmailAndPassword(username, password); // Adjust this if needed for checking username
    if (existingUser) {
      return res.status(400).send('User with this username already exists');
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds for bcrypt

    // Save the new user to the database
    const newUser = await createUser(username, hashedPassword);

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to register user');
  }
};


export const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).send('Refresh token is required');
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY);

    // After verifying the refresh token, we can generate a new access token
    const accessToken = jwt.sign(
      { username:user.username },
      process.env.JWT_SECRET_KEY, // Secret for access tokens
      { expiresIn: '12h' } // Access token expires in 12 hours
    );

    res.status(200).json({ accessToken });
  } catch (err) {
    console.error(err);
    res.status(403).send('Invalid or expired refresh token');
  }
};



export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Missing required parameters: username and password');
  }

  try {
    // Retrieve the user from the database based on username
    const user = await getUserByEmail(username);
    console.log('User from database:', user);
    if (user) {
      console.log('User from database:', user);

      // Compare the provided password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        // Passwords match, generate the JWT access token
        const accessToken = jwt.sign(
          { username: user.username },
          process.env.JWT_SECRET_KEY,
          { expiresIn: '12h' }
        );

        // Generate the refresh token with 30 days expiration
        const refreshToken = jwt.sign(
          { username: user.username },
          process.env.JWT_REFRESH_SECRET_KEY, 
          { expiresIn: '30d' }
        );

        res.status(200).json({ user, accessToken, refreshToken });
      } else {
        // Invalid password
        res.status(401).send('Invalid username or password');
      }
    } else {
      // User not found
      res.status(401).send('Invalid username or password');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to log in');
  }
};