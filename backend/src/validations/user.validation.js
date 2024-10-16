import joi from 'joi';

export const updateProfileValidation = joi.object({
  fullName: joi.string().required().messages({
    'string.base': 'Fullname must be a string',
    'string.empty': 'Fullname cannot empty',
    'any.required': 'Fullname is required',
  }),
  phone: joi.string().required().messages({
    'string.base': 'Phone must be a string',
    'string.empty': 'Phone cannot empty',
    'any.required': 'Phone is required',
  }),
  address: joi.string().required().messages({
    'string.base': 'Address must be a string',
    'string.empty': 'Address cannot empty',
    'any.required': 'Address is required',
  }),
  avatar: joi.string().required().messages({
    'string.base': 'Avatar must be a string',
    'string.empty': 'Avatar cannot empty',
    'any.required': 'Avatar is required',
  }),
});
