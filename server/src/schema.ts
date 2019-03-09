import { Model } from 'objection';
import objectionGraphql from 'objection-graphql';
import * as models from './models';
import { createMutations } from './mutations';
import knex from 'knex';

export default function createSchema(db: knex) {
    Model.knex(db);

    const builder = objectionGraphql
        .builder()
        .allModels(Object.values(models));

    createMutations(builder);

    return builder.build();
};
