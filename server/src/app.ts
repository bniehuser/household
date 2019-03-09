import db from "./db";
import knex from "knex";

import path from 'path';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import { json } from 'body-parser';
import { removeXPoweredBy, withAuth } from './middleware';
import createSchema from './schema';
import authRoutes from './routes/auth';

const { NODE_ENV, APOLLO_ENGINE_KEY } = process.env;

const isDev = NODE_ENV !== 'production';
interface IAppConfig {
    db: knex;
}
export default class App {
    private readonly _apollo: ApolloServer;
    private readonly _express: express.Express;

    constructor(config: IAppConfig) {
        this._apollo = new ApolloServer({
            schema: createSchema(config.db),
            introspection: isDev,
            playground: isDev,
            cors: false,
            bodyParserConfig: false,
            engine: {
                apiKey: APOLLO_ENGINE_KEY,
            },
        });

        this._express = express();

        this._express.use(removeXPoweredBy());

        this._express.use(cors());

        this._express.use(json());

        this._express.use(express.static(path.resolve(__dirname, '../static')));

        this._express.use(authRoutes);

        this._express.use(this._apollo.graphqlPath, withAuth(this._apollo));

        this._apollo.applyMiddleware({ app: this._express });
    }
    get express(): express.Express {
        return this._express;
    }
    get apollo(): ApolloServer {
        return this._apollo;
    }
};
