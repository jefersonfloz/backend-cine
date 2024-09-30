import { Response, Request } from "express";
import FuncionDAO from "../dao/FuncionDAO";
import Funcion from "../entity/Funcion";


class FuncionControlador extends FuncionDAO {
    damelasTodas(arg0: string, damelasTodas: any) {
        throw new Error("Method not implemented.");
    }
    public dameFuncion(req:Request, res:Response) {
        FuncionDAO.obtenerTodo([], res);
    }

    public cogeTuFuncion(req:Request, res:Response): void {
        const objCubi: Funcion = new Funcion(0, 0, "", "", new Date(), 0);
        objCubi.idPelicula = req.body.idPelicula; 
        objCubi.tipoFuncion = req.body.tipoFuncion; 
        objCubi.horaFuncion = req.body.horaFuncion; 
        objCubi.fechaFuncion = new Date(req.body.fechaFuncion); 
        objCubi.idSala = req.body.idSala;

        FuncionDAO.grabeloYa(objCubi, res);
    }

    public borraTuFuncion(req: Request, res: Response): void {
        if (isNaN(Number(req.params.idFuncion))) {
            res.status(400).json({ respuesta: "Y el código mi vale?" });
        } else {
            const codiguito = Number(req.params.idFuncion);
            const objCubi: Funcion = new Funcion(0, 0, "", "", new Date(), 0);
            FuncionDAO.borreloYa(objCubi, res);
        }
    }

    
    public actualizaTuFuncion(req: Request, res: Response): void {
        // Verifica si idFuncion está presente
        if (isNaN(Number(req.body.idFuncion))) {
            res.status(400).json({ respuesta: "Y el código mi vale?" });
        } else {
            const objCubi: Funcion = new Funcion(
                req.body.idFuncion,        
                req.body.idPelicula,      
                req.body.tipoFuncion,      
                req.body.horaFuncion,      
                new Date(req.body.fechaFuncion), 
                req.body.idSala           
            );
            
            FuncionDAO.actualiceloYa(objCubi, res);
        }
    }
    
}
const funcionControlador = new FuncionControlador();
export default funcionControlador;

