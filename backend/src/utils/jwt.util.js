import * as dotenv from 'dotenv';

import jwt from 'jsonwebtoken';

dotenv.config();

// generate token
export const handleGenerateToken = async ({ payload, secretKey = process.env.SECRET_KEY, expiresIn = '1h' }) => {
  const token = jwt.sign(payload, secretKey, { expiresIn });

  return token;
};

// verify token
export const handleVerifyToken = async ({ token, secretKey = process.env.SECRET_KEY }) => {
  const decoded = jwt.verify(token, secretKey);

  return decoded;
};
