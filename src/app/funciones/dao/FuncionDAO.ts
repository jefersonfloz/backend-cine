import { Response } from "express";
import { SQL_FUNCIONES } from "../repository/sql_funciones";
import pool from "../../../config/connection/dbConnection";
import Funcion from "../entity/Funcion";

class FuncionDAO {

    public static async paginarFunciones(limite: number, offset: number, res: Response): Promise<any> {
        await pool.result(SQL_FUNCIONES.PAGINATE_FUNTIONS, [limite, offset])
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
    }
    

    protected static async obtenerFuncion(params: any, res: Response) {
        await pool.result(SQL_FUNCIONES.GET_ALL, params).then((resultado) => {
            res.status(200).json(resultado.rows);
        }).catch((miError) => {
            console.log(miError);
            res.status(400).json({
                "Respuesta": "ay no sirve"
            });
        });
    }

    protected static async agregarFuncion(datos: Funcion, res: Response): Promise<any> {
        await pool
        .task(async (consulta) => {
            let queHacer = 0;
            let respuBase: any;
            const existeFuncion = await consulta.oneOrNone(SQL_FUNCIONES.CHECK_IF_EXISTS, [datos.idPelicula, datos.horaFuncion, datos.fechaFuncion,  datos.idSala]);
            const existePelicula = await consulta.oneOrNone(SQL_FUNCIONES.CHECK_IF_EXISTS_PELICULA, [datos.idPelicula]);
            const existeSala = await consulta.oneOrNone(SQL_FUNCIONES.CHECK_IF_EXISTS_SALA, [datos.idSala]);
            if(!existePelicula){
                queHacer =2;
                return { queHacer, respuBase };
            }
            if(!existeSala){
                queHacer =3;
                return { queHacer, respuBase };
            }
            if(existeFuncion){
                queHacer =1;
                return { queHacer, respuBase };
            }
            

            respuBase = await consulta.one(SQL_FUNCIONES.ADD, [datos.idPelicula, datos.tipoFuncion, datos.horaFuncion, datos.fechaFuncion,  datos.idSala]);  
            return { queHacer, respuBase };
        })
        .then(({ queHacer, respuBase }) => {
            switch (queHacer) {
                case 1:
                    res.status(400).json({ respuesta: "Compita ya existe la funcion" });
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
        .catch((miError:any) => {
            console.log(miError);
            res.status(400).json({ respuesta: "Se totió mano"});
        });
    }

    protected static async borrarFuncionTodo(res: Response): Promise<any> {
        pool
          .task(async (consulta) => {
            let queHacer = 1;
            let funcionesEliminadas = 0;
            const idDeFunciones: number[] = []; 
    
            // Obtener todas las funciones que no están relacionadas con la tabla Reservaciones
            const funcionesSinReservaciones = await consulta.any(SQL_FUNCIONES.FUNCIONES_SIN_RESERVACIONES);
    
            // Extraer solo los id_funcion asegurándote de obtener solo el ID
            const idsFuncionesSinReservaciones = funcionesSinReservaciones.map((funcion: any) => funcion.idFuncion);
    
            // Verificar si hay funciones no relacionadas para eliminar
            if (idsFuncionesSinReservaciones.length > 0) {
              queHacer = 2;
              
              // Iterar sobre los id_funcion sin reservaciones para eliminarlas
              for (const id_funcion of idsFuncionesSinReservaciones) {
                // Asegúrate de pasar solo el ID como número
                const resultado = await consulta.result(SQL_FUNCIONES.DELETE, [id_funcion]);
                idDeFunciones.push(id_funcion);
                funcionesEliminadas += resultado.rowCount;  // Contar cuántas funciones se eliminaron
              }
            }
    
            return { queHacer, funcionesEliminadas,idDeFunciones };
          })
          .then(({ queHacer, funcionesEliminadas,idDeFunciones }) => {
            switch (queHacer) {
              case 1:
                res.status(400).json({ respuesta: "No hay funciones disponibles para eliminar, todas están relacionadas con otras tablas." });
                break;
              default:
                res.status(200).json({ respuesta: "Borrado exitosamente", info: `Se eliminaron ${funcionesEliminadas} funciones`, id_funciones_eliminadas: `Se eliminaron las funciones con id: ${idDeFunciones}`});
                break;
            }
          })
          .catch((miErrorcito) => {
            console.log(miErrorcito);
            res.status(400).json({ respuesta: "Error al ejecutar la consulta SQL" });
          });
    }
    

    protected static async borrarFuncion(datos: Funcion, res: Response): Promise<any> {
        pool
          .task(async (consulta) => {
            let queHacer = 1;
            let respuBase: any;
            const existe = await consulta.oneOrNone(SQL_FUNCIONES.CHECK_IF_EXISTS_FUNCION, [datos.idFuncion]);
            const existe_relacion = await consulta.oneOrNone(SQL_FUNCIONES.CHECK_IF_EXISTS_FUNCION_RELATED, [datos.idFuncion]);
            if(existe && !existe_relacion) {
                queHacer =2;
                respuBase= await consulta.result(SQL_FUNCIONES.DELETE, [datos.idFuncion]);
            }
            return { queHacer, respuBase };
          })
          .then(({ queHacer, respuBase }) => {
            switch (queHacer) {
                case 1:
                    res.status(400).json({ respuesta: "No puedes eliminar esta funcion, tiene relacion con alguna tabla" });
                    break;
                default:
                    res.status(200).json({respuesta: "Lo borré sin miedo", info: respuBase.rowCount});
                    break;
            }
        }).catch((miErrorcito) => { 
            console.log(miErrorcito);
            res.status(400).json({ respuesta: "Pailas, sql totiado" });
          });
    }


    protected static async actualizarFuncion(datos: Funcion, res: Response): Promise<any> {
        pool
        .task(async (consulta) => {
            let queHacer = 1;
            let respuBase: any;
            const existe = await consulta.oneOrNone(SQL_FUNCIONES.CHECK_IF_EXISTS_FUNCION, [datos.idFuncion]);
            if(existe) {
                queHacer = 2;
                respuBase = await consulta.none(SQL_FUNCIONES.UPDATE, [datos.idFuncion,datos.idPelicula, datos.tipoFuncion, datos.horaFuncion, datos.fechaFuncion,  datos.idSala]);
            }
            return { queHacer, respuBase };
        })
        .then(({ queHacer, respuBase }) => {
            switch (queHacer) {
                case 1:
                    res.status(400).json({ respuesta: "La funcion no se encuentra en nuestra base de datos" });
                    break;
                  case 2:
                    res.status(200).json({ actualizado: "ok" });
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
        
    }

    
    //actualizar el tipo de funcion de las funciones con una sala especifica
    protected static async actualizarFuncionPorSala(datos: Funcion, res: Response): Promise<any> {
        pool
        .task(async (consulta) => {
            let queHacer = 1;
            let respuBase: any;
            const existeSal = await consulta.one(SQL_FUNCIONES.CHECK_IF_EXISTS_SALA, [datos.idSala]);
            if(existeSal.existe!=0) {
                queHacer = 2;
                respuBase = await consulta.none(SQL_FUNCIONES.UPDATE_TIPO_FUNCION_SALA, [datos.tipoFuncion, datos.idSala]);
            }
            return { queHacer, respuBase };
        })
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
        
    }

        
    // Actualizar la fecha de la función para todas las funciones de una película en una sala específica:
    protected static async actualizarFechaFuncion(datos: Funcion, res: Response): Promise<any> {
        pool
        .task(async (consulta) => {
            let queHacer = 1;
            let respuBase: any;
            
            // Verificar existencia de la película y la sala
            const existePel = await consulta.one(SQL_FUNCIONES.CHECK_IF_EXISTS_PELICULA, [datos.idPelicula]);
            const existeSal = await consulta.one(SQL_FUNCIONES.CHECK_IF_EXISTS_SALA, [datos.idSala]);
            
            if (existePel.existe != 0 && existeSal.existe != 0) {
                queHacer = 2;

                // Realizar la actualización y obtener el número de filas afectadas
                const resultado = await consulta.result(SQL_FUNCIONES.UPDATE_FECHA_FUNCION, [datos.fechaFuncion, datos.idPelicula, datos.idSala]);

                // Verificar si alguna fila fue realmente actualizada
                if (resultado.rowCount == 0) {
                    queHacer = 3; // Si no se actualizó ninguna fila
                }
            }

            return { queHacer, respuBase };
        })
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
    }



    protected static async actualizarFunciondeSala(idSala:Number,res: Response): Promise<any> {
        pool
        .task(async (consulta) => {
            let queHacer = 1;
            let respuBase: any;
            const existeSal = await consulta.one(SQL_FUNCIONES.CHECK_IF_EXISTS_SALA, [idSala]);
            if(existeSal.existe!=0) {
                queHacer = 2;
                respuBase = await consulta.none(SQL_FUNCIONES.UPDATE_FUNCIONES_SALAS, [idSala]);
            }
            return { queHacer, respuBase };
        })
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
        
    }



    protected static async actualizarFunciondePelicula(idPelicula:Number,res: Response): Promise<any> {
        pool
        .task(async (consulta) => {
            let respuBase: any;
            let queHacer = 1;
            respuBase = await consulta.none(SQL_FUNCIONES.UPDATE_FUNCIONES_PELICULA, [idPelicula]);
            return { queHacer, respuBase };
        })
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
        
    }

    
}    
export default FuncionDAO;