const Joi = require('joi');

const signupSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.alphanum': 'Username must only contain alphanumeric characters',
      'string.min': 'Username must be at least 3 characters long',
      'string.max': 'Username cannot exceed 30 characters',
      'any.required': 'Username is required'
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required'
    })
});

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});

const bookSchema = Joi.object({
  title: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'Title must be at least 2 characters long',
      'string.max': 'Title cannot exceed 100 characters',
      'any.required': 'Title is required'
    }),
  author: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'Author must be at least 2 characters long',
      'string.max': 'Author cannot exceed 100 characters',
      'any.required': 'Author is required'
    }),
  genre: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'Genre must be at least 2 characters long',
      'string.max': 'Genre cannot exceed 100 characters',
      'any.required': 'Genre is required'
    })
});

const reviewSchema = Joi.object({
  rating: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .required()
    .messages({
      'number.integer': 'Rating must be an integer',
      'number.min': 'Rating must be at least 1',
      'number.max': 'Rating cannot exceed 5',
      'any.required': 'Rating is required'
    }),
  comment: Joi.string()
    .min(5)
    .max(500)
    .required()
    .messages({
      'string.min': 'Comment must be at least 5 characters long',
      'string.max': 'Comment cannot exceed 500 characters',
      'any.required': 'Comment is required'
    })
});

module.exports = {
  signupSchema,
  loginSchema,
  bookSchema,
  reviewSchema
};