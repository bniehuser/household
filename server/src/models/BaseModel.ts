import { Model, QueryBuilder, QueryContext } from 'objection';
import { QueryResult } from "pg";

// TODO: NEED A BETTER WAY TO DO THIS

export class ApiQueryBuilder<T extends BaseModel> extends QueryBuilder<T> {
    constructor(modelClass: any) {
        // @ts-ignore
        super(modelClass); // i don't think this is necessary?  unless we were subclassing this class
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

export default abstract class BaseModel extends Model {
    // Objection Model Configs
    static get modelPaths() {
        return [__dirname];
    }
    static get tableName() {
        return this.name;
    }

    // tslint-disable-next-line
    static async modifyApiQuery(qb: ApiQueryBuilder<any>, context: QueryContext): Promise<void> {};

    // eslint-disable-next-line no-unused-vars
    static async modifyApiResults(result: any, context: QueryContext, qb: ApiQueryBuilder<any>): Promise<any> {
        return result;
    }

    static QueryBuilder = ApiQueryBuilder as any;
};