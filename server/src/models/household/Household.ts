import { Column, Entity, OneToMany } from 'typeorm';
import { TrackedModel } from '../_common/TrackedModel';
import { HouseholdMembership } from './HouseholdMembership';
import { Field, ObjectType } from "type-graphql/dist";

@Entity()
@ObjectType()
export class Household extends TrackedModel {

    @Column()
    @Field()
    name: string;

    @Column('text')
    @Field()
    motto: string;

    @Column('text')
    @Field()
    description: string;

    @OneToMany(() => HouseholdMembership, member => member.household)
    @Field(() => [HouseholdMembership])
    memberships: HouseholdMembership[];

}