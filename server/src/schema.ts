import { Model } from 'objection';
import * as models from './models';
import createMutations from './mutations';
import knex from 'knex';
// BAAH no typescript support
const objectionGraphql = require('objection-graphql');

export default function createSchema(db: knex) {
    Model.knex(db);

    const builder = objectionGraphql
        .builder()
        .allModels(Object.values(models));

    createMutations(builder);

    return builder.build();
};
