import cors from "cors";
import express from "express";
import morgan from "morgan";
import apiSalaRuta from "../../app/salas/route/SalaRuta";
import apiRutaPelicula from "../../app/peliculas/route/PeliculaRuta";
import apiRutaFuncion from "../../app/funciones/route/FuncionRuta";

class Servidor {
    public app:express.Application;

    constructor() {
        this.app = express();
        this.cargarConfiguracion();
        this.exponerEndPoint();
    }
    
    public cargarConfiguracion() :void {
        this.app.set("PORT", 3123);
        this.app.use(cors());
        this.app.use(morgan("dev"));
        //tamaño maximo de archivo
        this.app.use(express.json({limit:"50mb"}));
        this.app.use(express.urlencoded({extended:true}));
    }

    public exponerEndPoint():void {
        this.app.use("/salas",apiSalaRuta);
        this.app.use("/peliculas",apiRutaPelicula);
        this.app.use("/funciones",apiRutaFuncion);
    }

    public iniciar():void{
        this.app.listen(this.app.get("PORT"),()=>{
            console.log("Listo me fui", this.app.get("PORT"));
        });
    }
}

export default Servidor;