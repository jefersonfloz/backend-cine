import { Router } from "express";
import funcionControlador from "../controller/FuncionControlador";

class FuncionRuta {
    public apiRutaFuncion:Router;

    constructor() {
        this.apiRutaFuncion = Router();
        this.misRutas();
    }

    private misRutas(): void {
        this.apiRutaFuncion.get("/getFunciones", funcionControlador.dameFuncion);
        this.apiRutaFuncion.get("/getFuncionesPaginadas", funcionControlador.paginarFunciones);
        this.apiRutaFuncion.post("/addFuncion", funcionControlador.cogeTuFuncion);
        this.apiRutaFuncion.delete("/deleteFuncion", funcionControlador.borraTuFuncion);
        this.apiRutaFuncion.delete("/deleteFuncionporId/:idFuncion", funcionControlador.borraTuFuncionporId);
        this.apiRutaFuncion.put("/updateFuncion/:idFuncion", funcionControlador.actualizaTuFuncion);
        this.apiRutaFuncion.put("/updatetipoFuncionesPorSala", funcionControlador.actualizaFuncionesPorSala);
        this.apiRutaFuncion.put("/updateFechaFunciones", funcionControlador.actualizaFechasFunciones);
        //actualizar todas las funciones con una pelicula especifica
        this.apiRutaFuncion.put("/updateuncionesPeliculas/:idPelicula", funcionControlador.actualizaFuncionesPelicula);
        //actualizar todas las funciones con una pelicula especifica
        this.apiRutaFuncion.put("/updateFuncionesSalas/:idSala", funcionControlador.actualizaFuncionesSalas);
    }
}
const peliculaRuta= new FuncionRuta();
export default peliculaRuta.apiRutaFuncion;