import { Arg, Field, Mutation, ObjectType, Resolver } from 'type-graphql/dist';
import { getTokenFromLogin } from '../services/jwt';

@ObjectType()
class AuthResponse {

    constructor(token: string) {
        this.token = token;
        return this;
    }

    @Field()
    token: string;
}

@Resolver()
export class AuthResolver {
    @Mutation(() => AuthResponse)
    async requestToken(@Arg('email') email: string, @Arg('password') password: string) {
        const token = await getTokenFromLogin({email, password});
        return new AuthResponse(token);
    }
}