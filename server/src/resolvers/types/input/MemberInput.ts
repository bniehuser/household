import { Field, InputType } from "type-graphql/dist";
import { Member } from "../../../models/Member";

@InputType()
export class MemberInput implements Partial<Member> {
    @Field()
    firstName: string;

    @Field()
    lastName: string;

    @Field()
    alias: string;

    @Field()
    email: string;

    @Field({nullable: true})
    password: string;
}