import BaseModel, { ApiQueryBuilder } from './BaseModel';
import { QueryContext } from "objection";

export class User extends BaseModel {
    readonly id!: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;

    static get jsonSchema() {
        return {
            type: 'object',

            properties: {
                id: { type: 'integer' },
                firstName: { type: 'string', minLength: 1, maxLength: 255 },
                lastName: { type: 'string', minLength: 1, maxLength: 255 },
                email: { type: 'string', minLength: 1, maxLength: 255 },
                password: { type: 'string', minLength: 1, maxLength: 255 },
            },
        };
    }

    static async modifyApiQuery(qb: ApiQueryBuilder<User>, ctx: QueryContext) {
        console.log('modifyApiQuery', ctx);
        if (ctx.user) {
            qb.where('id', ctx.user.id);
        } else {
            qb.whereRaw('1=2');
        }
    }

    static get relationMappings() {
        return {
            projects: {
                relation: this.HasManyRelation,
                modelClass: 'Project',
                join: {
                    from: 'User.id',
                    to: 'Project.ownerId',
                },
            },
        };
    }
};
