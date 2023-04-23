"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const knex_1 = require("knex");
exports.db = (0, knex_1.knex)({
    client: "sqlite3",
    connection: {
        filename: "./src/database/database.db",
    },
    useNullAsDefault: true,
    pool: {
        min: 0,
        max: 1,
        afterCreate: (conn, cb) => {
            conn.run("PRAGMA foreign_keys = ON", cb);
        }
    }
});
//# sourceMappingURL=knex.js.map