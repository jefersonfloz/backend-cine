import { Router } from "express";
import funcionControlador from "../controller/FuncionControlador";

class FuncionRuta {
    public apiRutaFuncion:Router;

    constructor() {
        this.apiRutaFuncion = Router();
        this.misRutas();
    }

    private misRutas(): void {
        this.apiRutaFuncion.get("/getall", funcionControlador.dameFuncion);
        this.apiRutaFuncion.post("/add", funcionControlador.cogeTuFuncion);
        this.apiRutaFuncion.delete("/delete/:idPelicula", funcionControlador.borraTuFuncion);
        this.apiRutaFuncion.put("/update", funcionControlador.actualizaTuFuncion);
    }
}
const peliculaRuta= new FuncionRuta();
export default peliculaRuta.apiRutaFuncion;