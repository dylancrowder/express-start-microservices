import Joi from "joi";

export const createProductSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  price: Joi.number().positive().required(),
  stock: Joi.number().integer().min(0).required(),
  description: Joi.string().allow("").optional(),
  image: Joi.string().allow(null, "").optional(), // ahora acepta string vacío o null
});
