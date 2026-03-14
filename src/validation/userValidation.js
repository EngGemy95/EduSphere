import Joi from 'joi';

export const validateRegister = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    mobile: Joi.string().required(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

export const validateLogin = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    mobile: Joi.string().required(),
    password: Joi.string().min(6).required(),
    image: Joi.string().allow("")
  });
  return schema.validate(data);
};
