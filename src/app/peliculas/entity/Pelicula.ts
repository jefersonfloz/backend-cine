class Pelicula {
    public idPelicula: Number;
    public nombrePelicula: string;
    public idGenero: Number;
    public duracionPelicula: string;
    public clasificacionPelicula: string;
    public sinopsisPelicula: string;
    public repartoPelicula : string;

    constructor(idPelicula: Number,nomPel: string,idGe: Number,durPel: string,clas: string,sino: string,rep: string) {

        this.idPelicula = idPelicula;
        this.nombrePelicula = nomPel;
        this.idGenero = idGe;
        this.duracionPelicula = durPel;
        this.clasificacionPelicula = clas;
        this.sinopsisPelicula = sino;
        this.repartoPelicula = rep;
    }
}



export default Pelicula;