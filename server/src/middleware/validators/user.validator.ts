import { body } from 'express-validator';

const validateCreateUser = [
  body('email')
    .notEmpty()
    .withMessage('The email field is required when creating a user.')
    .isEmail()
    .normalizeEmail()
    .withMessage('The email field must contain a valid email address.')
];

export { validateCreateUser };