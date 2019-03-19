import { Arg, Field, Mutation, ObjectType, Resolver } from 'type-graphql/dist';
import { AuthService } from '../services';
import { Inject } from 'typedi';

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
    @Inject('AuthService')
    private readonly authService: AuthService;

    @Mutation(() => AuthResponse)
    async requestToken(@Arg('email') email: string, @Arg('password') password: string, @Arg('householdId') householdId?: number) {
        const token = await this.authService.authenticate({email, password, householdId});
        return new AuthResponse(token);
    }
}