import mutationType from './User';

interface IMutationList {
    [modelName: string]: any;
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