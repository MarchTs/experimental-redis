// import config from './src/config';

// console.log(`config`, config);
import * as DotEnv from "dotenv";

DotEnv.config();

module.exports = module.exports.development = module.exports.staging = module.exports.production = {

    client: process.env.DATABASE__DRIVER,
    connection: {
        host: process.env.DATABASE__HOST,
        database: process.env.DATABASE__DATABASE,
        user: process.env.DATABASE__USER,
        password: process.env.DATABASE__PASSWORD,
        port: process.env.DATABASE__PORT,
        multipleStatements: true
    },
    pool: {
        min: parseInt(process.env.DATABASE__POOL_MIN!),
        max: parseInt(process.env.DATABASE__POOL_MAX!)
    },
    migrations: {
        directory: "./migrations/"
    },

    // client: config.DATABASE__DRIVER,
    // connection: {
    //     host: config.DATABASE__HOST,
    //     database: config.DATABASE__DATABASE,
    //     user: config.DATABASE__USER,
    //     password: config.DATABASE__PASSWORD,
    //     port: config.DATABASE__PORT
    // },
    // pool: {
    //     min: parseInt(config.DATABASE__POOL_MIN),
    //     max: parseInt(config.DATABASE__POOL_MAX)
    // },
    // migrations: {
    //     directory: "./migrations/"
    // },
};

// console.log({

//     client: config.DATABASE__DRIVER,
//     connection: {
//         host: config.DATABASE__HOST,
//         database: config.DATABASE__DATABASE,
//         user: config.DATABASE__USER,
//         password: config.DATABASE__PASSWORD,
//         port: config.DATABASE__PORT
//     },
//     pool: {
//         min: parseInt(config.DATABASE__POOL_MIN),
//         max: parseInt(config.DATABASE__POOL_MAX)
//     },
//     migrations: {
//         directory: "./migrations/"
//     },
// });

