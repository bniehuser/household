import { Arg, Field, Mutation, ObjectType, Resolver } from 'type-graphql/dist';
import { getTokenFromLogin } from '../services/jwt';

@ObjectType()
class AuthResponse {

    constructor(token: string) {
        this.token = token;
    }

    @Field()
    token: string;
}

@Resolver()
export class AuthResolver {
    @Mutation(() => AuthResponse)
    async requestToken(@Arg('email') email: string, @Arg('password') password: string, @Arg('householdId') householdId?: number) {
        const token = await getTokenFromLogin({email, password, householdId});
        return new AuthResponse(token);
    }
}