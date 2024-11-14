"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sql_funciones_1 = require("../repository/sql_funciones");
const dbConnection_1 = __importDefault(require("../../../config/connection/dbConnection"));
class FuncionDAO {
    static paginarFunciones(limite, offset, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield dbConnection_1.default.result(sql_funciones_1.SQL_FUNCIONES.PAGINATE_FUNTIONS, [limite, offset])
                .then((resultado) => {
                res.status(200).json({
                    funciones: resultado.rows
                });
            })
                .catch((error) => {
                console.log(error);
                res.status(400).json({
                    "respuesta": "Error al realizar la consulta paginada"
                });
            });
        });
    }
    static obtenerFuncion(params, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield dbConnection_1.default.result(sql_funciones_1.SQL_FUNCIONES.GET_ALL, params).then((resultado) => {
                res.status(200).json(resultado.rows);
            }).catch((miError) => {
                console.log(miError);
                res.status(400).json({
                    "Respuesta": "ay no sirve"
                });
            });
        });
    }
    static agregarFuncion(datos, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield dbConnection_1.default
                .task((consulta) => __awaiter(this, void 0, void 0, function* () {
                let queHacer = 0;
                let respuBase;
                const existeFuncion = yield consulta.oneOrNone(sql_funciones_1.SQL_FUNCIONES.CHECK_IF_EXISTS, [datos.idPelicula, datos.horaFuncion, datos.fechaFuncion, datos.idSala]);
                const existePelicula = yield consulta.oneOrNone(sql_funciones_1.SQL_FUNCIONES.CHECK_IF_EXISTS_PELICULA, [datos.idPelicula]);
                const existeSala = yield consulta.oneOrNone(sql_funciones_1.SQL_FUNCIONES.CHECK_IF_EXISTS_SALA, [datos.idSala]);
                if (!existePelicula) {
                    queHacer = 2;
                    return { queHacer, respuBase };
                }
                if (!existeSala) {
                    queHacer = 3;
                    return { queHacer, respuBase };
                }
                if (existeFuncion) {
                    queHacer = 1;
                    return { queHacer, respuBase };
                }
                respuBase = yield consulta.one(sql_funciones_1.SQL_FUNCIONES.ADD, [datos.idPelicula, datos.tipoFuncion, datos.horaFuncion, datos.fechaFuncion, datos.idSala]);
                return { queHacer, respuBase };
            }))
                .then(({ queHacer, respuBase }) => {
                switch (queHacer) {
                    case 1:
                        res.status(400).json({ respuesta: "Ya existe la funcion" });
                        break;
                    case 2:
                        res.status(400).json({ respuesta: "La pelicula no existe" });
                        break;
                    case 3:
                        res.status(400).json({ respuesta: "La sala no existe" });
                        break;
                    default:
                        res.status(200).json(respuBase);
                        break;
                }
            })
                .catch((miError) => {
                console.log(miError);
                res.status(400).json({ respuesta: "Se totió mano" });
            });
        });
    }
    static borrarFuncionTodo(res) {
        return __awaiter(this, void 0, void 0, function* () {
            dbConnection_1.default
                .task((consulta) => __awaiter(this, void 0, void 0, function* () {
                let queHacer = 1;
                let funcionesEliminadas = 0;
                const idDeFunciones = [];
                // Obtener todas las funciones que no están relacionadas con la tabla Reservaciones
                const funcionesSinReservaciones = yield consulta.any(sql_funciones_1.SQL_FUNCIONES.FUNCIONES_SIN_RESERVACIONES);
                // Extraer solo los id_funcion asegurándote de obtener solo el ID
                const idsFuncionesSinReservaciones = funcionesSinReservaciones.map((funcion) => funcion.idFuncion);
                // Verificar si hay funciones no relacionadas para eliminar
                if (idsFuncionesSinReservaciones.length > 0) {
                    queHacer = 2;
                    // Iterar sobre los id_funcion sin reservaciones para eliminarlas
                    for (const id_funcion of idsFuncionesSinReservaciones) {
                        // Asegúrate de pasar solo el ID como número
                        const resultado = yield consulta.result(sql_funciones_1.SQL_FUNCIONES.DELETE, [id_funcion]);
                        idDeFunciones.push(id_funcion);
                        funcionesEliminadas += resultado.rowCount; // Contar cuántas funciones se eliminaron
                    }
                }
                return { queHacer, funcionesEliminadas, idDeFunciones };
            }))
                .then(({ queHacer, funcionesEliminadas, idDeFunciones }) => {
                switch (queHacer) {
                    case 1:
                        res.status(400).json({ respuesta: "No hay funciones disponibles para eliminar, todas están relacionadas con otras tablas." });
                        break;
                    default:
                        res.status(200).json({ respuesta: "Borrado exitosamente", info: `Se eliminaron ${funcionesEliminadas} funciones`, id_funciones_eliminadas: `Se eliminaron las funciones con id: ${idDeFunciones}` });
                        break;
                }
            })
                .catch((miErrorcito) => {
                console.log(miErrorcito);
                res.status(400).json({ respuesta: "Error al ejecutar la consulta SQL" });
            });
        });
    }
    static borrarFuncion(datos, res) {
        return __awaiter(this, void 0, void 0, function* () {
            dbConnection_1.default
                .task((consulta) => __awaiter(this, void 0, void 0, function* () {
                let queHacer = 1;
                let respuBase;
                const existe = yield consulta.oneOrNone(sql_funciones_1.SQL_FUNCIONES.CHECK_IF_EXISTS_FUNCION, [datos.idFuncion]);
                const existe_relacion = yield consulta.oneOrNone(sql_funciones_1.SQL_FUNCIONES.CHECK_IF_EXISTS_FUNCION_RELATED, [datos.idFuncion]);
                if (existe && !existe_relacion) {
                    queHacer = 2;
                    respuBase = yield consulta.result(sql_funciones_1.SQL_FUNCIONES.DELETE, [datos.idFuncion]);
                }
                return { queHacer, respuBase };
            }))
                .then(({ queHacer, respuBase }) => {
                switch (queHacer) {
                    case 1:
                        res.status(400).json({ respuesta: "No puedes eliminar esta funcion, tiene relacion con alguna tabla" });
                        break;
                    default:
                        res.status(200).json({ respuesta: "Lo borré sin miedo", info: respuBase.rowCount });
                        break;
                }
            }).catch((miErrorcito) => {
                console.log(miErrorcito);
                res.status(400).json({ respuesta: "Pailas, sql totiado" });
            });
        });
    }
    static actualizarFuncion(datos, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield dbConnection_1.default
                .task((consulta) => __awaiter(this, void 0, void 0, function* () {
                let queHacer = 0;
                let respuBase;
                const existeFuncion = yield consulta.oneOrNone(sql_funciones_1.SQL_FUNCIONES.CHECK_IF_EXISTS_FUNCION, [datos.idFuncion]);
                const existePelicula = yield consulta.oneOrNone(sql_funciones_1.SQL_FUNCIONES.CHECK_IF_EXISTS_PELICULA, [datos.idPelicula]);
                const existeSala = yield consulta.oneOrNone(sql_funciones_1.SQL_FUNCIONES.CHECK_IF_EXISTS_SALA, [datos.idSala]);
                if (!existePelicula) {
                    queHacer = 2;
                    return { queHacer, respuBase };
                }
                if (!existeSala) {
                    queHacer = 3;
                    return { queHacer, respuBase };
                }
                if (!existeFuncion) {
                    queHacer = 1;
                    return { queHacer, respuBase };
                }
                respuBase = yield consulta.one(sql_funciones_1.SQL_FUNCIONES.UPDATE, [datos.idFuncion, datos.idPelicula, datos.tipoFuncion, datos.horaFuncion, datos.fechaFuncion, datos.idSala]);
                return { queHacer, respuBase };
            }))
                .then(({ queHacer, respuBase }) => {
                switch (queHacer) {
                    case 1:
                        res.status(400).json({ respuesta: "No existe la funcion" });
                        break;
                    case 2:
                        res.status(400).json({ respuesta: "La pelicula no existe" });
                        break;
                    case 3:
                        res.status(400).json({ respuesta: "La sala no existe" });
                        break;
                    default:
                        res.status(200).json({ respuesta: "Actualizado correctamente" });
                        break;
                }
            })
                .catch((miError) => {
                console.log(miError);
                res.status(400).json({ respuesta: "Se totió mano" });
            });
        });
    }
    //actualizar el tipo de funcion de las funciones con una sala especifica
    static actualizarFuncionPorSala(datos, res) {
        return __awaiter(this, void 0, void 0, function* () {
            dbConnection_1.default
                .task((consulta) => __awaiter(this, void 0, void 0, function* () {
                let queHacer = 1;
                let respuBase;
                const existeSal = yield consulta.one(sql_funciones_1.SQL_FUNCIONES.CHECK_IF_EXISTS_SALA, [datos.idSala]);
                if (existeSal.existe != 0) {
                    queHacer = 2;
                    respuBase = yield consulta.none(sql_funciones_1.SQL_FUNCIONES.UPDATE_TIPO_FUNCION_SALA, [datos.tipoFuncion, datos.idSala]);
                }
                return { queHacer, respuBase };
            }))
                .then(({ queHacer, respuBase }) => {
                switch (queHacer) {
                    case 1:
                        res.status(200).json({ respuesta: "La sala no existe" });
                        break;
                    case 2:
                        res.status(200).json({ actualizado: "Funciones actualizadas" });
                        break;
                    default:
                        res.status(200).json({ respuesta: "Error al actualizar" });
                        break;
                }
            })
                .catch((miErrorcito) => {
                console.log(miErrorcito);
                res.status(400).json({ respuesta: "Pailas, sql totiado" });
            });
        });
    }
    // Actualizar la fecha de la función para todas las funciones de una película en una sala específica:
    static actualizarFechaFuncion(datos, res) {
        return __awaiter(this, void 0, void 0, function* () {
            dbConnection_1.default
                .task((consulta) => __awaiter(this, void 0, void 0, function* () {
                let queHacer = 1;
                let respuBase;
                // Verificar existencia de la película y la sala
                const existePel = yield consulta.one(sql_funciones_1.SQL_FUNCIONES.CHECK_IF_EXISTS_PELICULA, [datos.idPelicula]);
                const existeSal = yield consulta.one(sql_funciones_1.SQL_FUNCIONES.CHECK_IF_EXISTS_SALA, [datos.idSala]);
                if (existePel.existe != 0 && existeSal.existe != 0) {
                    queHacer = 2;
                    // Realizar la actualización y obtener el número de filas afectadas
                    const resultado = yield consulta.result(sql_funciones_1.SQL_FUNCIONES.UPDATE_FECHA_FUNCION, [datos.fechaFuncion, datos.idPelicula, datos.idSala]);
                    // Verificar si alguna fila fue realmente actualizada
                    if (resultado.rowCount == 0) {
                        queHacer = 3; // Si no se actualizó ninguna fila
                    }
                }
                return { queHacer, respuBase };
            }))
                .then(({ queHacer, respuBase }) => {
                switch (queHacer) {
                    case 1:
                        res.status(200).json({ respuesta: "La sala y/o película no coinciden con la funcion" });
                        break;
                    case 2:
                        res.status(200).json({ actualizado: "Funciones actualizadas" });
                        break;
                    case 3:
                        res.status(200).json({ respuesta: "No se encontró ninguna función que coincida con los criterios dados" });
                        break;
                    default:
                        res.status(200).json({ respuesta: "Error al actualizar" });
                        break;
                }
            })
                .catch((miErrorcito) => {
                console.log(miErrorcito);
                res.status(400).json({ respuesta: "Pailas, sql totiado" });
            });
        });
    }
    static actualizarFunciondeSala(idSala, res) {
        return __awaiter(this, void 0, void 0, function* () {
            dbConnection_1.default
                .task((consulta) => __awaiter(this, void 0, void 0, function* () {
                let queHacer = 1;
                let respuBase;
                const existeSal = yield consulta.one(sql_funciones_1.SQL_FUNCIONES.CHECK_IF_EXISTS_SALA, [idSala]);
                if (existeSal.existe != 0) {
                    queHacer = 2;
                    respuBase = yield consulta.none(sql_funciones_1.SQL_FUNCIONES.UPDATE_FUNCIONES_SALAS, [idSala]);
                }
                return { queHacer, respuBase };
            }))
                .then(({ queHacer, respuBase }) => {
                switch (queHacer) {
                    case 1:
                        res.status(200).json({ respuesta: "La sala no existe" });
                        break;
                    case 2:
                        res.status(200).json({ actualizado: "Funciones actualizadas" });
                        break;
                    default:
                        res.status(200).json({ respuesta: "Error al actualizar" });
                        break;
                }
            })
                .catch((miErrorcito) => {
                console.log(miErrorcito);
                res.status(400).json({ respuesta: "Pailas, sql totiado" });
            });
        });
    }
    static actualizarFunciondePelicula(idPelicula, res) {
        return __awaiter(this, void 0, void 0, function* () {
            dbConnection_1.default
                .task((consulta) => __awaiter(this, void 0, void 0, function* () {
                let respuBase;
                let queHacer = 1;
                respuBase = yield consulta.none(sql_funciones_1.SQL_FUNCIONES.UPDATE_FUNCIONES_PELICULA, [idPelicula]);
                return { queHacer, respuBase };
            }))
                .then(({ queHacer, respuBase }) => {
                switch (queHacer) {
                    case 1:
                        res.status(200).json({ actualizado: "Funciones actualizadas" });
                        break;
                    default:
                        res.status(200).json({ respuesta: "Error al actualizar" });
                        break;
                }
            })
                .catch((miErrorcito) => {
                console.log(miErrorcito);
                res.status(400).json({ respuesta: "Pailas, sql totiado" });
            });
        });
    }
}
exports.default = FuncionDAO;
