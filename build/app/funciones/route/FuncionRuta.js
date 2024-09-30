"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const FuncionControlador_1 = __importDefault(require("../controller/FuncionControlador"));
class FuncionRuta {
    constructor() {
        this.apiRutaFuncion = (0, express_1.Router)();
        this.misRutas();
    }
    misRutas() {
        this.apiRutaFuncion.get("/getall", FuncionControlador_1.default.dameFuncion);
        this.apiRutaFuncion.post("/add", FuncionControlador_1.default.cogeTuFuncion);
        this.apiRutaFuncion.delete("/delete/:idPelicula", FuncionControlador_1.default.borraTuFuncion);
        this.apiRutaFuncion.put("/update", FuncionControlador_1.default.actualizaTuFuncion);
    }
}
const peliculaRuta = new FuncionRuta();
exports.default = peliculaRuta.apiRutaFuncion;
