import Joi from "joi";

export const createProductSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  price: Joi.number().positive().required(),
  stock: Joi.number().integer().min(0).required(),
  description: Joi.string().allow("").optional(),
  image: Joi.string().allow(null, "").optional(), // ahora acepta string vacío o null
});

// Registro de usuario
export const authVerification = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// Validar un ObjectId de MongoDB
export const idSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/) // patrón de ObjectId (24 caracteres hexadecimales)
    .required()
    .messages({
      "string.base": "El ID debe ser un texto",
      "string.empty": "El ID no puede estar vacío",
      "string.pattern.base": "El ID no es válido",
      "any.required": "El ID es obligatorio",
    }),
});
