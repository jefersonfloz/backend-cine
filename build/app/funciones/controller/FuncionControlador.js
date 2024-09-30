"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FuncionDAO_1 = __importDefault(require("../dao/FuncionDAO"));
const Funcion_1 = __importDefault(require("../entity/Funcion"));
class FuncionControlador extends FuncionDAO_1.default {
    damelasTodas(arg0, damelasTodas) {
        throw new Error("Method not implemented.");
    }
    dameFuncion(req, res) {
        FuncionDAO_1.default.obtenerTodo([], res);
    }
    cogeTuFuncion(req, res) {
        const objCubi = new Funcion_1.default(0, 0, "", "", new Date(), 0);
        objCubi.idPelicula = req.body.idPelicula;
        objCubi.tipoFuncion = req.body.tipoFuncion;
        objCubi.horaFuncion = req.body.horaFuncion;
        objCubi.fechaFuncion = new Date(req.body.fechaFuncion);
        objCubi.idSala = req.body.idSala;
        FuncionDAO_1.default.grabeloYa(objCubi, res);
    }
    borraTuFuncion(req, res) {
        if (isNaN(Number(req.params.idFuncion))) {
            res.status(400).json({ respuesta: "Y el código mi vale?" });
        }
        else {
            const codiguito = Number(req.params.idFuncion);
            const objCubi = new Funcion_1.default(0, 0, "", "", new Date(), 0);
            FuncionDAO_1.default.borreloYa(objCubi, res);
        }
    }
    actualizaTuFuncion(req, res) {
        // Verifica si idFuncion está presente
        if (isNaN(Number(req.body.idFuncion))) {
            res.status(400).json({ respuesta: "Y el código mi vale?" });
        }
        else {
            const objCubi = new Funcion_1.default(req.body.idFuncion, req.body.idPelicula, req.body.tipoFuncion, req.body.horaFuncion, new Date(req.body.fechaFuncion), req.body.idSala);
            FuncionDAO_1.default.actualiceloYa(objCubi, res);
        }
    }
}
const funcionControlador = new FuncionControlador();
exports.default = funcionControlador;
