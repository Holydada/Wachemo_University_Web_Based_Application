import { Request, Response, NextFunction } from 'express';

// Sanitize HTML to prevent XSS
export const sanitizeHtml = (str: string): string => {
  if (!str) return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Validate WCU ID format
export const validateWcuId = (wcuId: string): boolean => {
  const wcuIdPattern = /^WCU\/\d{4}\/\d{6}$/;
  return wcuIdPattern.test(wcuId);
};

// Validate email format
export const validateEmail = (email: string): boolean => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

// Validate password strength
export const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!/\d/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one special character' };
  }
  return { valid: true };
};

// Validate phone number
export const validatePhone = (phone: string): boolean => {
  const phonePattern = /^\+?[1-9]\d{1,14}$/;
  return phonePattern.test(phone);
};

// Input validation middleware
export const validateInput = (req: Request, res: Response, next: NextFunction): void => {
  // Sanitize all string inputs in body
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeHtml(req.body[key].trim());
      }
    });
  }
  
  next();
};

// Validate registration data
export const validateRegistration = (req: Request, res: Response, next: NextFunction): void => {
  const { wcu_id, email, password, full_name } = req.body;
  
  const errors: string[] = [];
  
  if (!wcu_id || !validateWcuId(wcu_id)) {
    errors.push('Invalid WCU ID format. Expected: WCU/YYYY/XXXXXX');
  }
  
  if (email && !validateEmail(email)) {
    errors.push('Invalid email format');
  }
  
  if (!password) {
    errors.push('Password is required');
  } else {
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      errors.push(passwordValidation.message!);
    }
  }
  
  if (!full_name || full_name.length < 2) {
    errors.push('Full name must be at least 2 characters long');
  }
  
  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
    return;
  }
  
  next();
};

// Validate login data
export const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
  const { wcuId, password } = req.body;
  
  if (!wcuId || !password) {
    res.status(400).json({
      success: false,
      message: 'WCU ID and password are required'
    });
    return;
  }
  
  next();
};

// Validate pagination parameters
export const validatePagination = (req: Request, res: Response, next: NextFunction): void => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  
  if (page < 1) {
    res.status(400).json({
      success: false,
      message: 'Page must be greater than 0'
    });
    return;
  }
  
  if (limit < 1 || limit > 100) {
    res.status(400).json({
      success: false,
      message: 'Limit must be between 1 and 100'
    });
    return;
  }
  
  req.query.page = page.toString();
  req.query.limit = limit.toString();
  
  next();
};
