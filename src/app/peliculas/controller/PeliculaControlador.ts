import { Response, Request } from "express";
import PeliculaDAO from "../dao/PeliculaDAO";
import Pelicula from "../entity/Pelicula";

class PeliculaControlador extends PeliculaDAO {
    damelasTodas(arg0: string, damelasTodas: any) {
        throw new Error("Method not implemented.");
    }
    public damePelicula(req:Request, res:Response) {
        PeliculaDAO.obtenerTodo([], res);
    }

    public cogeTuPelicula(req:Request, res:Response): void {
        const objCubi: Pelicula = new Pelicula(0, "", 0, "", "", "", "");
        objCubi.nombrePelicula = req.body.nombrePelicula; 
        objCubi.idGenero = req.body.idGenero; 
        objCubi.duracionPelicula = req.body.duracionPelicula; 
        objCubi.clasificacionPelicula = req.body.clasificacionPelicula; 
        objCubi.sinopsisPelicula = req.body.sinopsisPelicula; 
        objCubi.repartoPelicula = req.body.repartoPelicula;
    
        PeliculaDAO.grabeloYa(objCubi, res);
    }

    public borraTuPelicula(req: Request, res: Response): void {
        if (isNaN(Number(req.params.idPelicula))) {
            res.status(400).json({ respuesta: "Y el código mi vale?" });
        } else {
            const codiguito = Number(req.params.idPelicula);
            const objCubi: Pelicula = new Pelicula(codiguito,"", 0,"","","","" );
            PeliculaDAO.borreloYa(objCubi, res);
        }
    }

    
    public actualizaTuPelicula(req: Request, res: Response): void {
        // Verifica si idPelicula está presente
        if (isNaN(Number(req.body.idPelicula))) {
            res.status(400).json({ respuesta: "Y el código mi vale?" });
        } else {
            const objCubi: Pelicula = new Pelicula(
                req.body.idPelicula,  // Asegúrate de usar el id de la película
                req.body.nombrePelicula,
                req.body.idGenero,
                req.body.duracionPelicula,
                req.body.clasificacionPelicula,
                req.body.sinopsisPelicula,
                req.body.repartoPelicula
            );
            PeliculaDAO.actualiceloYa(objCubi, res);
        }
    }
    
}
const peliculaControlador = new PeliculaControlador();
export default peliculaControlador;

