import path from 'path';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import { json } from 'body-parser';
import { removeXPoweredBy } from '../middleware';
import authRoutes from './routes/auth';
import { buildSchema } from "type-graphql";
import AllResolvers from "../resolvers";
import { Container, Inject } from "typedi";
import { AuthService, LogService } from '../services';

const { NODE_ENV, APOLLO_ENGINE_KEY } = process.env;

const isDev = NODE_ENV !== 'production';

export default class App {
    private _apollo: ApolloServer;
    private _express: express.Express;

    constructor(
        @Inject('AuthService') private readonly authService: AuthService,
        @Inject('LogService') private readonly logService: LogService,
    ) {}

    async init() {

        this._express = express();

        const schema = await buildSchema({
            resolvers: AllResolvers,
            container: Container,
            authChecker: this.authService.authChecker,
        });

        this._apollo = new ApolloServer({
            schema,
            introspection: isDev,
            playground: isDev,
            engine: {
                apiKey: APOLLO_ENGINE_KEY,
            },
            context: this.authService.getRequestContext.bind(this.authService),
        });

        this._express.use(removeXPoweredBy());

        this._express.use(cors());

        this._express.use(json());

        this._express.use(express.static(path.resolve(__dirname, '../static')));

        this._express.use(this.logService.preRouteLogging);

        this._express.use(authRoutes);

        this._apollo.applyMiddleware({
            app: this._express,
            cors: false,
            bodyParserConfig: false,
        });

        this._express.use(this.logService.postRouteLogging);
    }
    get express(): express.Express {
        return this._express;
    }
    get apollo(): ApolloServer {
        return this._apollo;
    }
};
