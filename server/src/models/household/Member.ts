import { TrackedModel } from "../_common/TrackedModel";
import { Column, Entity, OneToMany } from "typeorm";
import { HouseholdMembership } from './HouseholdMembership';
import { Field, ObjectType } from "type-graphql/dist";

@Entity()
@ObjectType()
export class Member extends TrackedModel {

    @Column({ nullable: true })
    @Field()
    firstName: string;

    @Column({ nullable: true })
    @Field()
    lastName: string;

    @Column({ nullable: true })
    @Field()
    alias: string;

    @Column('text')
    @Field()
    email: string;

    @Column('text')
    password: string; // should ALWAYS be hashed before we see it here, no plaintext pw's please!

    @OneToMany(() => HouseholdMembership, membership => membership.member)
    @Field(() => [HouseholdMembership])
    memberships: HouseholdMembership[];

    // accessors
    @Field()
    get fullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }

}