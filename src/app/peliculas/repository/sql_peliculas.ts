export const SQL_PELICULAS = {
    GET_ALL: "SELECT p.id_pelicula, p.nombre_pelicula, p.id_genero,\
    p.duracion_pelicula, p.clasificacion, p.sinopsis,p.reparto \
    FROM cine.peliculas p",

    ADD: "INSERT INTO cine.peliculas (nombre_pelicula, id_genero,\
    duracion_pelicula, clasificacion, sinopsis,reparto) \
    VALUES ($1, $2, $3,$4,$5,$6) RETURNING id_pelicula",

    HOW_MANY:"SELECT COUNT(id_pelicula) AS existe FROM cine.peliculas WHERE id_pelicula = $1",

    DELETE: "DELETE FROM cine.peliculas WHERE id_pelicula = $1",

    UPDATE: "UPDATE cine.peliculas SET nombre_pelicula = $2, id_genero = $3,\
    duracion_pelicula = $4, clasificacion = $5, sinopsis = $6, reparto = $7 \
    WHERE id_pelicula= $1",
};


