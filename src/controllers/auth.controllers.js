import logger from '#src/config/logger.js';
import { signUpSchema, signInSchema } from '#src/Validations/auth.validation.js';
import { formatValidationErrors } from '#Utils/format.js';
import { createUser, authenticateUser } from '#src/Services/auth.service.js';
import { jwttoken } from '#src/Utils/jwt.js'; // Fixed: Import your JWT utility, not from 'zod'

export const signup = async (req, res, next) => {
  try{
    const validationResult = signUpSchema.safeParse(req.body);

    if(!validationResult.success) {
      return res.status(400).json({
        error: 'Validation error',
        details: formatValidationErrors(validationResult.error)
      });
    }

    const {name, email, role} = validationResult.data;
    
    const newUser = await createUser(validationResult.data);

    const token = jwttoken.sign({id: newUser.id, email: newUser.email, role: newUser.role}); // Fixed: Use jwttoken.sign

    res.cookie('token', token, { // Fixed: Use res.cookie instead of cookies.set
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    logger.info(`User registered successfully: ${email}`);
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id, 
        name: newUser.name, 
        email: newUser.email, 
        role: newUser.role
      } 
    });

  } catch (e) {
    logger.error('SIGNUP ERROR', e);

    if (e.message === 'User already exists') {
      return res.status(409).json({error: 'Email already exists'});
    }
    
    res.status(500).json({
      error: 'Internal server error',
      message: e.message
    });
  }
};

export const signin = async (req, res, next) => {
  try {
    const validationResult = signInSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation error',
        details: formatValidationErrors(validationResult.error)
      });
    }

    const { email, password } = validationResult.data;
    
    const user = await authenticateUser(email, password);

    const token = jwttoken.sign({ id: user.id, email: user.email, role: user.role });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    logger.info(`User signed in successfully: ${email}`);
    res.status(200).json({
      message: 'User signed in successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (e) {
    logger.error('SIGNIN ERROR', e);

    if (e.message === 'User not found' || e.message === 'Invalid credentials') {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    res.status(500).json({
      error: 'Internal server error',
      message: e.message
    });
  }
};

export const signout = async (req, res, next) => {
  try {
    // Clear the token cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });

    logger.info('User signed out successfully');
    res.status(200).json({
      message: 'User signed out successfully'
    });

  } catch (e) {
    logger.error('SIGNOUT ERROR', e);
    
    res.status(500).json({
      error: 'Internal server error',
      message: e.message
    });
  }
};
