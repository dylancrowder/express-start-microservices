import Joi from "joi";

// Registro de usuario
export const authVerification = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});
