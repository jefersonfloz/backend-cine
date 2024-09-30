"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Pelicula {
    constructor(idPelicula, nomPel, idGe, durPel, clas, sino, rep) {
        this.idPelicula = idPelicula;
        this.nombrePelicula = nomPel;
        this.idGenero = idGe;
        this.duracionPelicula = durPel;
        this.clasificacionPelicula = clas;
        this.sinopsisPelicula = sino;
        this.repartoPelicula = rep;
    }
}
exports.default = Pelicula;
