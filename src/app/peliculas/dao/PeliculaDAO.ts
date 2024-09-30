import { Response } from "express";
import { SQL_PELICULAS } from "../repository/sql_peliculas";
import pool from "../../../config/connection/dbConnection";
import Pelicula from "../entity/Pelicula";

class PeliculaDAO {
    protected static async obtenerTodo(params: any, res: Response) {
        await pool.result(SQL_PELICULAS.GET_ALL, params).then((resultado) => {
            res.status(200).json(resultado.rows);
        }).catch((miError) => {
            console.log(miError);
            res.status(400).json({
                "Respuesta": "ay no sirve"
            });
        });
    }

    protected static async grabeloYa(datos: Pelicula, res: Response): Promise<any> {
        await pool
        .task(async (consulta) => {
            let queHacer =1;
            let respuBase: any;
            //const cubi = await consulta.one(SQL_SALAS.HOW_MANY, [datos.idSala]);
            //if(cubi.existe ==0) {
                queHacer =2;
                respuBase = await consulta.one(SQL_PELICULAS.ADD, [datos.nombrePelicula, datos.idGenero, datos.duracionPelicula, datos.clasificacionPelicula,  datos.sinopsisPelicula,  datos.repartoPelicula]);
            //}
            return { queHacer, respuBase };
        })
        .then(({ queHacer, respuBase }) => {
            switch (queHacer) {
                case 1:
                    res.status(400).json({ respuesta: "Compita ya existe la pelicula" });
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

    protected static async borreloYa(datos: Pelicula, res: Response): Promise<any> {
        pool
          .task((consulta) => {
            return consulta.result(SQL_PELICULAS.DELETE, [datos.idPelicula]);
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

    protected static async actualiceloYa(datos: Pelicula, res: Response): Promise<any> {
        pool
        .task(async (consulta) => {
            let queHacer = 1;
            let respuBase: any;
            const cubi = await consulta.one(SQL_PELICULAS.HOW_MANY, [datos.idPelicula]);
            if(cubi.existe !=0) {
                queHacer = 2;
                respuBase = await consulta.none(SQL_PELICULAS.UPDATE, [datos.idPelicula, datos.nombrePelicula, datos.idGenero, datos.duracionPelicula, datos.clasificacionPelicula,  datos.sinopsisPelicula,  datos.repartoPelicula]);
            }
            return { queHacer, respuBase };
        })
        .then(({ queHacer, respuBase }) => {
            switch (queHacer) {
                case 1:
                    res.status(400).json({ respuesta: "Compita no existes en nuestra base de datos" });
                    break;
                  case 2:
                      res.status(200).json({ actualizado: "ok" });
                  break;
                default:
                    res.status(200).json({ respuesta: "Algo salio mal al momento de actualizar" });
                    break;
            }
        })
        .catch((miErrorcito) => {
            console.log(miErrorcito);
            res.status(400).json({ respuesta: "Pailas, sql totiado" });
        });
        
    }
}    
export default PeliculaDAO;