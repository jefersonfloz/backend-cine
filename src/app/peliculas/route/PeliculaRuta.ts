import { Router } from "express";
import peliculaControlador from "../controller/PeliculaControlador";

class PeliculaRuta {
    public apiRutaPelicula:Router;

    constructor() {
        this.apiRutaPelicula = Router();
        this.misRutas();
    }

    private misRutas(): void {
        this.apiRutaPelicula.get("/getall", peliculaControlador.damePelicula);
        this.apiRutaPelicula.post("/add", peliculaControlador.cogeTuPelicula);
        this.apiRutaPelicula.delete("/delete/:idPelicula", peliculaControlador.borraTuPelicula);
        this.apiRutaPelicula.put("/update", peliculaControlador.actualizaTuPelicula);
    }
}
const peliculaRuta= new PeliculaRuta();
export default peliculaRuta.apiRutaPelicula;