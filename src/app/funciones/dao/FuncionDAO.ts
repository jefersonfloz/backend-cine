import { Response } from "express";
import { SQL_FUNCIONES } from "../repository/sql_funciones";
import pool from "../../../config/connection/dbConnection";
import Funcion from "../entity/Funcion";

class FuncionDAO {
    protected static async obtenerTodo(params: any, res: Response) {
        await pool.result(SQL_FUNCIONES.GET_ALL, params).then((resultado) => {
            res.status(200).json(resultado.rows);
        }).catch((miError) => {
            console.log(miError);
            res.status(400).json({
                "Respuesta": "ay no sirve"
            });
        });
    }

    protected static async grabeloYa(datos: Funcion, res: Response): Promise<any> {
        await pool
        .task(async (consulta) => {
            let queHacer =1;
            let respuBase: any;
            const existe = await consulta.oneOrNone(SQL_FUNCIONES.CHECK_IF_EXISTS, [datos.idPelicula, datos.horaFuncion, datos.fechaFuncion,  datos.idSala]);
            if(!existe) {
                queHacer =2;
                respuBase = await consulta.one(SQL_FUNCIONES.ADD, [datos.idPelicula, datos.tipoFuncion, datos.horaFuncion, datos.fechaFuncion,  datos.idSala]);
            }
            return { queHacer, respuBase };
        })
        .then(({ queHacer, respuBase }) => {
            switch (queHacer) {
                case 1:
                    res.status(400).json({ respuesta: "Compita ya existe la funcion" });
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

    protected static async borreloYa(datos: Funcion, res: Response): Promise<any> {
        pool
          .task((consulta) => {
            return consulta.result(SQL_FUNCIONES.DELETE, [datos.idFuncion]);
          })
          .then((respuesta) => {
            res.status(200).json({
                respuesta: "Lo borré sin miedo",
                info: respuesta.rowCount,
            });
          })
          .catch((miErrorcito) => {
            console.log(miErrorcito);
            res.status(400).json({ respuesta: "Pailas, sql totiado" });
          });
    }

    protected static async actualiceloYa(datos: Funcion, res: Response): Promise<any> {
        pool
        .task(async (consulta) => {
            let queHacer = 1;
            let respuBase: any;
            const cubi = await consulta.one(SQL_FUNCIONES.HOW_MANY, [datos.idFuncion]);
            if(cubi.existe !=0) {
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
}    
export default FuncionDAO;