import logger from '#src/config/logger.js';
import bcrypt from 'bcrypt';
import {eq} from 'drizzle-orm';
import {db} from '#src/config/database.js';
import { users } from '#src/models/user.model.js';

export const hashPassword = async password => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (e) {
    logger.error(`Error hashing the password: ${e}`);
    throw new Error('Error hashing');
  }
};

export const comparePassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (e) {
    logger.error(`Error comparing password: ${e}`);
    throw new Error('Error comparing password');
  }
};

export const authenticateUser = async (email, password) => {
  try {
    // Check if user exists
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    
    if (!user) {
      throw new Error('User not found');
    }

    // Validate password
    const isPasswordValid = await comparePassword(password, user.password);
    
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    logger.info(`User ${user.email} authenticated successfully`);
    return userWithoutPassword;

  } catch (e) {
    logger.error('Error authenticating user', e);
    
    // Re-throw known errors
    if (e.message === 'User not found' || e.message === 'Invalid credentials') {
      throw e;
    }
    
    throw new Error('Error authenticating user');
  }
};

export const createUser = async({name, email, password, role}) => {
  try{
    // Fixed: Added await and proper checking
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (existingUser.length > 0) {
      throw new Error('User already exists'); // This should be caught in controller
    }

    const passwordHash = await hashPassword(password);

    const [newUser] = await db.insert(users).values({
      name,
      email,
      password: passwordHash,
      role
    }).returning({id: users.id, name: users.name, email: users.email, role: users.role, createdAt: users.createdAt});

    logger.info(`User ${newUser.email} created successfully`);
    return newUser;

  }catch(e) {
    logger.error('Error creating user', e);
    
    // Handle unique constraint violation specifically
    if (e.cause?.code === '23505') {
      throw new Error('User already exists');
    }
    
    throw new Error('Error creating user');
  }
};


