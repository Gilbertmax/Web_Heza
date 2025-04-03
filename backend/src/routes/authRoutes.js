import express from 'express';
import { 
  register, 
  login, 
  adminLogin, 
  getProfile, 
  updateProfile, 
  changePassword,
  requestPasswordReset,
  resetPassword,
  requestClientAccess,
  requestUserAccess
} from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js'; 

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/admin/login', adminLogin);
// Make sure these routes are defined
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);
router.post('/request-client-access', requestClientAccess);
router.post('/request-user-access', requestUserAccess);

// Protected routes
router.get('/profile', verifyToken, getProfile); 
router.put('/profile', verifyToken, updateProfile); 
router.post('/change-password', verifyToken, changePassword); 

export default router;