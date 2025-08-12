"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hola = void 0;
const hola = (req, res, next) => {
    console.log("hola");
    next();
};
exports.hola = hola;
