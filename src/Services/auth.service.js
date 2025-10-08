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


