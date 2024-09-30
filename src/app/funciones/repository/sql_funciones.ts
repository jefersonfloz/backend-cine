export const SQL_FUNCIONES = {
    GET_ALL: "SELECT f.id_funcion, f.id_pelicula, f.tipo_funcion, f.hora_funcion,\
    f.fecha_funcion,f.id_sala \
    FROM cine.funciones f",

    ADD: "INSERT INTO cine.funciones (id_pelicula, tipo_funcion, hora_funcion,\
    fecha_funcion,id_sala ) \
    VALUES ($1, $2, $3,$4,$5) RETURNING id_funcion",

    HOW_MANY:"SELECT COUNT(id_funcion) AS existe FROM cine.funciones WHERE id_funcion = $1",

    CHECK_IF_EXISTS: `
        SELECT 1 AS existe
        FROM cine.funciones
        WHERE id_pelicula = $1 AND hora_funcion = $2
        AND fecha_funcion = $3 AND id_sala = $4;

    `,

    DELETE: "DELETE FROM cine.funciones WHERE id_funcion = $1",

    UPDATE: "UPDATE cine.funciones SET id_pelicula = $2, tipo_funcion = $3,\
    hora_funcion = $4, fecha_funcion = $5, id_sala  = $6 \
    WHERE id_funcion= $1",
};


