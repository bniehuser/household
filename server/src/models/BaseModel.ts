import { Model, QueryBuilder, QueryContext } from 'objection';
import { QueryResult } from "pg";

// TODO: NEED A BETTER WAY TO DO THIS

class ApiQueryBuilder<T extends BaseModel> extends QueryBuilder<T> {
    constructor(modelClass: T) {
        super(modelClass);
        this.runBefore(async (result, qb) => {
            const context = qb.context();
            if (!context.isApiQuery) return;
            await modelClass.modifyApiQuery(qb, context);
        });
        this.runAfter(async (result, qb) => {
            const context = qb.context();
            if (!context.isApiQuery) return result;
            return modelClass.modifyApiResults(result, context, qb);
        });
    }
}

export default class BaseModel extends Model {
    // Objection Model Configs
    static get modelPaths() {
        return [__dirname];
    }
    static get tableName() {
        return this.name;
    }

    // tslint-disable-next-line
    static async modifyApiQuery(qb: ApiQueryBuilder<BaseModel>, context: QueryContext) {}

    // eslint-disable-next-line no-unused-vars
    static async modifyApiResults(result: QueryResult, context: QueryContext, qb: ApiQueryBuilder<BaseModel>) {
        return result;
    }

    static QueryBuilder = ApiQueryBuilder;
};