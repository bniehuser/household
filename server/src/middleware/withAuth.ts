import { ApolloServer, ForbiddenError } from 'apollo-server-express';
import { getUserFromRequest } from '../util/jwt';
import { Request, Response, NextFunction } from "express";
import { QueryBuilderBase } from "objection";

export const withAuth = (server: ApolloServer) => (
    async (req: Request, res: Response, next: NextFunction) => {
        const user = await getUserFromRequest(req);

        // this should still work
        // @ts-ignore
        server.context = () => {
            if (!user) {
                throw new ForbiddenError('Invalid credentials');
            }
            return { user };
        };

        res.locals.user = user;

        server.requestOptions.rootValue = {
            async onQuery(qb: QueryBuilderBase<any, any, any>) {
                await qb.mergeContext({
                    isApiQuery: true,
                    user,
                });
            },
        };

        next();
    }
);