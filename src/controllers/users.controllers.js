import logger from '#src/config/logger.js';
import { getAllUser, getUserById as getUser, updateUser as updateUserService, deleteUser as deleteUserService } from '#src/Services/user.service.js';
import { userIdSchema, updateUserSchema } from '#src/Validations/user.validation.js';
import { formatValidationErrors } from '#src/Utils/format.js';


export const fetchAllUsers = async (req, res) => {
  try{
    logger.info('Fetching all users');

    const allUsers = await getAllUser();

    res.json({
      message: 'Users fetched successfully',
      users : allUsers,
      count : allUsers.length,
    });

  }catch(e){
    logger.error('Error in fetchAllUsers controller', e);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch users'
    });
  }
    
};

export const getUserById = async (req, res) => {
  try {
    // Validate ID parameter
    const validationResult = userIdSchema.safeParse({ id: req.params.id });

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation error',
        details: formatValidationErrors(validationResult.error)
      });
    }

    const { id } = validationResult.data;
    logger.info(`Fetching user with id ${id}`);

    const user = await getUser(id);

    res.status(200).json({
      message: 'User fetched successfully',
      user
    });

  } catch (e) {
    logger.error('Error in getUserById controller', e);

    if (e.message === 'User not found') {
      return res.status(404).json({
        error: 'Not found',
        message: 'User not found'
      });
    }

    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch user'
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    // Validate ID parameter
    const idValidationResult = userIdSchema.safeParse({ id: req.params.id });

    if (!idValidationResult.success) {
      return res.status(400).json({
        error: 'Validation error',
        details: formatValidationErrors(idValidationResult.error)
      });
    }

    // Validate update body
    const bodyValidationResult = updateUserSchema.safeParse(req.body);

    if (!bodyValidationResult.success) {
      return res.status(400).json({
        error: 'Validation error',
        details: formatValidationErrors(bodyValidationResult.error)
      });
    }

    const { id } = idValidationResult.data;
    const updates = bodyValidationResult.data;

    // Authorization checks
    const authenticatedUser = req.user; // Assumes auth middleware sets req.user

    if (!authenticatedUser) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }

    // Check if user is trying to update their own information or is an admin
    if (authenticatedUser.id !== id && authenticatedUser.role !== 'admin') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only update your own information'
      });
    }

    // Only admins can change roles
    if (updates.role && authenticatedUser.role !== 'admin') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Only admins can change user roles'
      });
    }

    logger.info(`Updating user with id ${id}`);

    const updatedUser = await updateUserService(id, updates);

    res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser
    });

  } catch (e) {
    logger.error('Error in updateUser controller', e);

    if (e.message === 'User not found') {
      return res.status(404).json({
        error: 'Not found',
        message: 'User not found'
      });
    }

    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update user'
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    // Validate ID parameter
    const validationResult = userIdSchema.safeParse({ id: req.params.id });

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation error',
        details: formatValidationErrors(validationResult.error)
      });
    }

    const { id } = validationResult.data;

    // Authorization checks
    const authenticatedUser = req.user; // Assumes auth middleware sets req.user

    if (!authenticatedUser) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }

    // Only admins can delete users, or users can delete themselves
    if (authenticatedUser.id !== id && authenticatedUser.role !== 'admin') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only delete your own account'
      });
    }

    logger.info(`Deleting user with id ${id}`);

    const result = await deleteUserService(id);

    res.status(200).json({
      message: 'User deleted successfully',
      data: result
    });

  } catch (e) {
    logger.error('Error in deleteUser controller', e);

    if (e.message === 'User not found') {
      return res.status(404).json({
        error: 'Not found',
        message: 'User not found'
      });
    }

    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to delete user'
    });
  }
};

