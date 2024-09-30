"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const pg_promise_1 = __importDefault(require("pg-promise"));
const optionsPG_1 = require("./optionsPG");
dotenv_1.default.config({ path: "variables.env" });
const nombre = String(process.env.NOMBRE_BASE_DE_DATOS);
const usuario = String(process.env.EL_USUARIO);
const puerto = Number(process.env.EL_PUERTO);
const servidor = String(process.env.EL_SERVIDOR);
const clave = String(process.env.LA_CLAVE);
const pgp = (0, pg_promise_1.default)(optionsPG_1.optionsPG);
const pool = pgp({
    user: usuario,
    password: clave,
    port: puerto,
    database: nombre,
    host: servidor
});
pool.connect().then((miConn) => {
    console.log("Dios mio sirve ", nombre);
    miConn.done();
}).catch((miError) => {
    console.log(miError);
});
exports.default = pool;
