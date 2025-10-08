import jwt from 'jsonwebtoken';
import logger from '../config/logger.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-please-change-in-production';

const JWT_EXPIRATION = '1h'; // Token expiration time


export const jwttoken = {
  sign: (payload) => {
    try {
      return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

    } catch (e) {
      logger.error('failed to authenticate token', e);
      throw new Error('Failed to authenticate token');

    }

  },

  verify: (token) => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (e) {
      logger.error('Invalid token', e);
      throw new Error('Invalid token');
    }
  }
};