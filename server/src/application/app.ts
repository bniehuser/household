import path from 'path';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import { json } from 'body-parser';
import { removeXPoweredBy, withAuth } from '../middleware/index';
import authRoutes from './routes/auth';
import { postRouteLogging, preRouteLogging } from "../services/logging";
import { buildSchema } from "type-graphql";
import AllResolvers from "../resolvers";
import { Container } from "typedi";

const { NODE_ENV, APOLLO_ENGINE_KEY } = process.env;

const isDev = NODE_ENV !== 'production';

export default class App {
    private _apollo: ApolloServer;
    private _express: express.Express;


    async init() {

        this._express = express();

        const schema = await buildSchema({resolvers: AllResolvers, container: Container,});

        this._apollo = new ApolloServer({
            schema,
            introspection: isDev,
            playground: isDev,
            engine: {
                apiKey: APOLLO_ENGINE_KEY,
            },
        });

        this._express.use(removeXPoweredBy());

        this._express.use(cors());

        this._express.use(json());

        this._express.use(express.static(path.resolve(__dirname, '../static')));

        this._express.use(preRouteLogging);

        this._express.use(authRoutes);

        // this._express.use(this._apollo.graphqlPath, withAuth(this._apollo));

        this._apollo.applyMiddleware({
            app: this._express,
            cors: false,
            bodyParserConfig: false,
        });

        this._express.use(postRouteLogging);
    }
    get express(): express.Express {
        return this._express;
    }
    get apollo(): ApolloServer {
        return this._apollo;
    }
};
