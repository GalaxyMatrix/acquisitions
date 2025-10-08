import logger from '#src/config/logger.js';
import { signUpSchema } from '#src/Validations/auth.validation.js';
import { formatValidationErrors } from '#src/Utils/format.js';
import { createUser } from '#src/Services/auth.service.js';
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