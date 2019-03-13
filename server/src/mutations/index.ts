import mutationType from './User';
import { GraphQLObjectType } from "graphql";

interface IMutationList {
    [modelName: string]: GraphQLObjectType;
}
const mutations: IMutationList = {
    User: mutationType,
};

const createMutations = (builder: any) => {
    Object.keys(mutations).forEach((name: string) => {
        builder.extendWithMutations(mutations[name]);
    });
};

export default createMutations;