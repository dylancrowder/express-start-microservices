"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.idSchema = exports.authVerification = exports.createProductSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createProductSchema = joi_1.default.object({
    name: joi_1.default.string().min(1).max(100).required(),
    price: joi_1.default.number().positive().required(),
    stock: joi_1.default.number().integer().min(0).required(),
    description: joi_1.default.string().allow("").optional(),
    image: joi_1.default.string().allow(null, "").optional(), // ahora acepta string vacío o null
});
// Registro de usuario
exports.authVerification = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(6).required(),
});
// Validar un ObjectId de MongoDB
exports.idSchema = joi_1.default.object({
    id: joi_1.default.string()
        .pattern(/^[0-9a-fA-F]{24}$/) // patrón de ObjectId (24 caracteres hexadecimales)
        .required()
        .messages({
        "string.base": "El ID debe ser un texto",
        "string.empty": "El ID no puede estar vacío",
        "string.pattern.base": "El ID no es válido",
        "any.required": "El ID es obligatorio",
    }),
});
