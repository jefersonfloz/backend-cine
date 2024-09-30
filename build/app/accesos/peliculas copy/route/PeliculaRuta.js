"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PeliculaControlador_1 = __importDefault(require("../controller/PeliculaControlador"));
class PeliculaRuta {
    constructor() {
        this.apiRutaPelicula = (0, express_1.Router)();
        this.misRutas();
    }
    misRutas() {
        this.apiRutaPelicula.get("/getall", PeliculaControlador_1.default.damePelicula);
        this.apiRutaPelicula.post("/add", PeliculaControlador_1.default.cogeTuPelicula);
        this.apiRutaPelicula.delete("/delete/:idPelicula", PeliculaControlador_1.default.borraTuPelicula);
        this.apiRutaPelicula.put("/update", PeliculaControlador_1.default.actualizaTuPelicula);
    }
}
const peliculaRuta = new PeliculaRuta();
exports.default = peliculaRuta.apiRutaPelicula;
