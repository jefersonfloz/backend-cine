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
        this.apiRutaFuncion.get("/getFunciones", FuncionControlador_1.default.dameFuncion);
        this.apiRutaFuncion.get("/getFuncionesPaginadas", FuncionControlador_1.default.paginarFunciones);
        this.apiRutaFuncion.post("/addFuncion", FuncionControlador_1.default.cogeTuFuncion);
        this.apiRutaFuncion.delete("/deleteFuncion/:idFuncion", FuncionControlador_1.default.borraTuFuncion);
        this.apiRutaFuncion.put("/updateFuncion", FuncionControlador_1.default.actualizaTuFuncion);
        this.apiRutaFuncion.put("/updateFuncionesPorSala", FuncionControlador_1.default.actualizaFuncionesPorSala);
        this.apiRutaFuncion.put("/updateFechaFunciones", FuncionControlador_1.default.actualizaFechasFunciones);
    }
}
const peliculaRuta = new FuncionRuta();
exports.default = peliculaRuta.apiRutaFuncion;
