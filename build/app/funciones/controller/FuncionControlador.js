"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FuncionDAO_1 = __importDefault(require("../dao/FuncionDAO"));
const Funcion_1 = __importDefault(require("../entity/Funcion"));
class FuncionControlador extends FuncionDAO_1.default {
    paginarFunciones(req, res) {
        const { limite = '10', offset = '0' } = req.query;
        const limiteNum = parseInt(limite, 10); // Default 10 resultados
        const offsetNum = parseInt(offset, 10); // Default desde el inicio
        // Validación de 'limite'
        if (isNaN(limiteNum) || limiteNum <= 0) {
            res.status(400).json({
                error: "El parámetro 'limite' debe ser un número positivo.",
                recibido: limite
            });
            return;
        }
        // Validación de 'offset'
        if (isNaN(offsetNum) || offsetNum < 0) {
            res.status(400).json({
                error: "El parámetro 'offset' debe ser un número igual o mayor a 0.",
                recibido: offset
            });
            return;
        }
        FuncionDAO_1.default.paginarFunciones(limiteNum, offsetNum, res);
    }
    dameFuncion(req, res) {
        FuncionDAO_1.default.obtenerFuncion([], res);
    }
    cogeTuFuncion(req, res) {
        const objCubi = new Funcion_1.default(0, 0, "", "", new Date(), 0);
        objCubi.idPelicula = req.body.idPelicula;
        objCubi.tipoFuncion = req.body.tipoFuncion;
        objCubi.horaFuncion = req.body.horaFuncion;
        objCubi.fechaFuncion = new Date(req.body.fechaFuncion);
        objCubi.idSala = req.body.idSala;
        FuncionDAO_1.default.agregarFuncion(objCubi, res);
    }
    borraTuFuncion(req, res) {
        FuncionDAO_1.default.borrarFuncionTodo(res);
    }
    borraTuFuncionporId(req, res) {
        const codiguito = Number(req.params.idFuncion);
        const objCubi = new Funcion_1.default(codiguito, 0, "", "", new Date(), 0);
        FuncionDAO_1.default.borrarFuncion(objCubi, res);
    }
    actualizaTuFuncion(req, res) {
        // Verifica si idFuncion está presente
        if (isNaN(Number(req.body.idFuncion))) {
            res.status(400).json({ respuesta: "Y el código mi vale?" });
        }
        else {
            const objCubi = new Funcion_1.default(req.body.idFuncion, req.body.idPelicula, req.body.tipoFuncion, req.body.horaFuncion, new Date(req.body.fechaFuncion), req.body.idSala);
            FuncionDAO_1.default.actualizarFuncion(objCubi, res);
        }
    }
    actualizaFuncionesPorSala(req, res) {
        const objCubi = new Funcion_1.default(req.body.idFuncion, req.body.idPelicula, req.body.tipoFuncion, req.body.horaFuncion, new Date(req.body.fechaFuncion), req.body.idSala);
        FuncionDAO_1.default.actualizarFuncionPorSala(objCubi, res);
    }
    actualizaFechasFunciones(req, res) {
        const objCubi = new Funcion_1.default(req.body.idFuncion, req.body.idPelicula, req.body.tipoFuncion, req.body.horaFuncion, new Date(req.body.fechaFuncion), req.body.idSala);
        FuncionDAO_1.default.actualizarFechaFuncion(objCubi, res);
    }
    actualizaFuncionesSalas(req, res) {
        const idSala = parseInt(req.params.idSala);
        FuncionDAO_1.default.actualizarFunciondeSala(idSala, res);
    }
    actualizaFuncionesPelicula(req, res) {
        const idPelicula = parseInt(req.params.idPelicula);
        FuncionDAO_1.default.actualizarFunciondePelicula(idPelicula, res);
    }
}
const funcionControlador = new FuncionControlador();
exports.default = funcionControlador;
