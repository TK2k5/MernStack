import joi from 'joi';

export const BrandValidation = joi.object({
  nameBrand: joi.string().required().messages({
    'string.base': 'Name must be a string',
    'string.empty': 'Name cannot empty',
    'any.required': 'Name is required',
  }),
  desc: joi.string().required().messages({
    'string.base': 'Desc must be a string',
    'string.empty': 'Desc cannot empty',
    'any.required': 'Desc is required',
  }),
  country: joi.string().default('Viet Nam').messages({
    'string.base': 'Country must be a string',
    'string.empty': 'Country cannot empty',
  }),
  image: joi.string().required().messages({
    'string.base': 'Image must be a string',
    'string.empty': 'Image cannot empty',
    'any.required': 'Image is required',
  }),
  status: joi.string().valid('active', 'inactive').default('active'),
});
