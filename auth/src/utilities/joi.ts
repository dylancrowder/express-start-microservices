import Joi from "joi";

// Query por nombre
export const querySchema = Joi.object({
  nombre: Joi.string().required().messages({
    "string.base": "El nombre debe ser un texto",
    "string.empty": "El nombre es requerido",
    "any.required": "El nombre es obligatorio",
  }),
});

// Query por ID numérico
export const queryID = Joi.object({
  id: Joi.number().required().messages({
    "number.base": "El ID debe ser un número",
    "any.required": "El ID es obligatorio",
  }),
});

// Query por filtros
export const productQuerySchema = Joi.object({
  category: Joi.string().messages({
    "string.base": "La categoría debe ser un texto",
  }),
  brand: Joi.string().messages({
    "string.base": "La marca debe ser un texto",
  }),
  condition: Joi.string().valid("new", "used").messages({
    "any.only": "La condición debe ser 'new' o 'used'",
  }),
  is_featured: Joi.boolean().messages({
    "boolean.base": "Debe ser verdadero o falso",
  }),
  published: Joi.boolean().messages({
    "boolean.base": "Debe ser verdadero o falso",
  }),
  sortBy: Joi.string().messages({
    "string.base": "El campo sortBy debe ser un texto",
  }),
  sortOrder: Joi.string().valid("asc", "desc").messages({
    "any.only": "El orden debe ser 'asc' o 'desc'",
  }),
});

// ID MongoDB
export const productIdSchema = Joi.object({
  id: Joi.string().length(24).required().messages({
    "string.base": "El ID debe ser un texto",
    "string.length": "El ID debe tener 24 caracteres",
    "any.required": "El ID es obligatorio",
  }),
});

// Creación de producto
export const productCreateSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "El nombre es requerido",
    "any.required": "El nombre es obligatorio",
  }),
  slug: Joi.string().required().messages({
    "string.empty": "El slug es requerido",
    "any.required": "El slug es obligatorio",
  }),
  description: Joi.string().required().messages({
    "string.empty": "La descripción es requerida",
    "any.required": "La descripción es obligatoria",
  }),
  short_description: Joi.string().optional().messages({
    "string.base": "La descripción corta debe ser un texto",
  }),
  price: Joi.number().min(0).required().messages({
    "number.base": "El precio debe ser un número",
    "number.min": "El precio no puede ser negativo",
    "any.required": "El precio es obligatorio",
  }),
  discount_price: Joi.number().min(0).optional().messages({
    "number.base": "El precio con descuento debe ser un número",
    "number.min": "El precio con descuento no puede ser negativo",
  }),
  stock: Joi.number().integer().min(0).required().messages({
    "number.base": "El stock debe ser un número",
    "number.integer": "El stock debe ser entero",
    "number.min": "El stock no puede ser negativo",
    "any.required": "El stock es obligatorio",
  }),
  stock_alert_level: Joi.number().integer().min(0).optional().messages({
    "number.base": "La alerta debe ser un número",
    "number.integer": "La alerta debe ser entera",
    "number.min": "La alerta no puede ser negativa",
  }),
  sku: Joi.string().optional().messages({
    "string.base": "El SKU debe ser un texto",
  }),
  category: Joi.string().required().messages({
    "string.empty": "La categoría es requerida",
    "any.required": "La categoría es obligatoria",
  }),
  category_slug: Joi.string().optional(),
  tags: Joi.array()
    .items(
      Joi.string().messages({
        "string.base": "Cada etiqueta debe ser un texto",
      })
    )
    .optional()
    .messages({
      "array.base": "Los tags deben ser un array de texto",
    }),
  brand: Joi.string().optional().messages({
    "string.base": "La marca debe ser un texto",
  }),
  condition: Joi.string().valid("new", "used").optional().messages({
    "any.only": "La condición debe ser 'new' o 'used'",
    "string.base": "La condición debe ser un texto",
  }),
  is_featured: Joi.boolean().optional().messages({
    "boolean.base": "Debe ser verdadero o falso",
  }),
  image_url: Joi.string().optional().messages({
    "string.uri": "La URL de la imagen no es válida",
  }),
  image_alt: Joi.string().optional().messages({
    "string.base": "El texto alternativo debe ser un texto",
  }),
  gallery: Joi.array()
    .items(
      Joi.string().uri().messages({
        "string.uri": "Cada imagen debe tener una URL válida",
      })
    )
    .optional()
    .messages({
      "array.base": "La galería debe ser un array de URLs",
    }),
  meta_title: Joi.string().optional().messages({
    "string.base": "El título SEO debe ser un texto",
  }),
  meta_description: Joi.string().optional().messages({
    "string.base": "La descripción SEO debe ser un texto",
  }),
  published: Joi.boolean().required().messages({
    "boolean.base": "Debe ser verdadero o falso",
    "any.required": "El campo publicado es obligatorio",
  }),
  rating: Joi.number().min(0).max(5).optional().messages({
    "number.base": "La calificación debe ser un número",
    "number.min": "La calificación no puede ser menor que 0",
    "number.max": "La calificación no puede ser mayor que 5",
  }),
  reviews_count: Joi.number().integer().min(0).optional().messages({
    "number.base": "El recuento de reseñas debe ser un número",
    "number.integer": "El recuento debe ser entero",
    "number.min": "El recuento no puede ser negativo",
  }),
  weight_kg: Joi.number().min(0).optional().messages({
    "number.base": "El peso debe ser un número",
    "number.min": "El peso no puede ser negativo",
  }),
  dimensions_cm: Joi.object({
    width: Joi.number().min(0).required().messages({
      "number.base": "El ancho debe ser un número",
      "number.min": "El ancho no puede ser negativo",
      "any.required": "El ancho es obligatorio",
    }),
    height: Joi.number().min(0).required().messages({
      "number.base": "La altura debe ser un número",
      "number.min": "La altura no puede ser negativa",
      "any.required": "La altura es obligatoria",
    }),
    depth: Joi.number().min(0).required().messages({
      "number.base": "La profundidad debe ser un número",
      "number.min": "La profundidad no puede ser negativa",
      "any.required": "La profundidad es obligatoria",
    }),
  })
    .optional()
    .messages({
      "object.base": "Las dimensiones deben ser un objeto",
    }),
  variants: Joi.array()
    .items(
      Joi.object({
        id: Joi.number().required().messages({
          "number.base": "El ID debe ser un número",
          "any.required": "El ID de la variante es obligatorio",
        }),
        name: Joi.string().required().messages({
          "string.base": "El nombre de la variante debe ser un texto",
          "any.required": "El nombre de la variante es obligatorio",
        }),
        stock: Joi.number().integer().min(0).required().messages({
          "number.base": "El stock de la variante debe ser un número",
          "number.integer": "El stock debe ser un número entero",
          "number.min": "El stock de la variante no puede ser negativo",
          "any.required": "El stock de la variante es obligatorio",
        }),
        price: Joi.number().optional().messages({
          "number.base": "El precio de la variante debe ser un número",
        }),
        /*   image_url: Joi.string().optional().messages({
          "string.uri": "La URL de la imagen de la variante no es válida",
        }), */
      })
    )
    .optional()
    .messages({
      "array.base": "Las variantes deben ser un array de objetos",
    }),
});

// Update basado en create con todos los campos opcionales
export const productUpdateSchema = productCreateSchema.fork(
  Object.keys(productCreateSchema.describe().keys),
  (schema) => schema.optional()
);
