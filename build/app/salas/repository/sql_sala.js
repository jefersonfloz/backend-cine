"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SQL_SALAS = void 0;
exports.SQL_SALAS = {
    GET_ALL: "SELECT s.id_sala, s.capacidad_sala, s.formato_sala, s.id_cine \
    FROM cine.salas s",
    ADD: "INSERT INTO cine.salas (capacidad_sala, formato_sala, id_cine) \
    VALUES ($1, $2, $3) RETURNING id_sala",
    HOW_MANY: "SELECT COUNT(*) AS existe FROM cine.salas WHERE id_sala = $1",
    DELETE: "DELETE FROM cine.salas WHERE id_sala = $1",
    UPDATE: "UPDATE cine.salas SET capacidad_sala = $2, formato_sala = $3, id_cine= $4 \
    WHERE id_sala= $1",
};
