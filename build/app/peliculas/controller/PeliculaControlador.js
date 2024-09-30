"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PeliculaDAO_1 = __importDefault(require("../dao/PeliculaDAO"));
const Pelicula_1 = __importDefault(require("../entity/Pelicula"));
class PeliculaControlador extends PeliculaDAO_1.default {
    damelasTodas(arg0, damelasTodas) {
        throw new Error("Method not implemented.");
    }
    damePelicula(req, res) {
        PeliculaDAO_1.default.obtenerTodo([], res);
    }
    cogeTuPelicula(req, res) {
        const objCubi = new Pelicula_1.default(0, "", 0, "", "", "", "");
        objCubi.nombrePelicula = req.body.nombrePelicula;
        objCubi.idGenero = req.body.idGenero;
        objCubi.duracionPelicula = req.body.duracionPelicula;
        objCubi.clasificacionPelicula = req.body.clasificacionPelicula;
        objCubi.sinopsisPelicula = req.body.sinopsisPelicula;
        objCubi.repartoPelicula = req.body.repartoPelicula;
        PeliculaDAO_1.default.grabeloYa(objCubi, res);
    }
    borraTuPelicula(req, res) {
        if (isNaN(Number(req.params.idPelicula))) {
            res.status(400).json({ respuesta: "Y el código mi vale?" });
        }
        else {
            const codiguito = Number(req.params.idPelicula);
            const objCubi = new Pelicula_1.default(codiguito, "", 0, "", "", "", "");
            PeliculaDAO_1.default.borreloYa(objCubi, res);
        }
    }
    actualizaTuPelicula(req, res) {
        // Verifica si idPelicula está presente
        if (isNaN(Number(req.body.idPelicula))) {
            res.status(400).json({ respuesta: "Y el código mi vale?" });
        }
        else {
            const objCubi = new Pelicula_1.default(req.body.idPelicula, // Asegúrate de usar el id de la película
            req.body.nombrePelicula, req.body.idGenero, req.body.duracionPelicula, req.body.clasificacionPelicula, req.body.sinopsisPelicula, req.body.repartoPelicula);
            PeliculaDAO_1.default.actualiceloYa(objCubi, res);
        }
    }
}
const peliculaControlador = new PeliculaControlador();
exports.default = peliculaControlador;
