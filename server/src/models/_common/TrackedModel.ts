import { Column, ManyToOne } from "typeorm";
import { TimedModel } from "./TimedModel";
import { Member } from '../household/Member';
import { Field, ID } from "type-graphql/dist";

export abstract class TrackedModel extends TimedModel {
    @ManyToOne(() => Member)
    @Field(() => Member, { nullable: true })
    createdBy: Member;

    @Column({ nullable: true })
    @Field(() => ID, { nullable: true })
    createdById: number;

    @ManyToOne(() => Member)
    @Field(() => Member, { nullable: true })
    editedBy: Member;

    @Column({ nullable: true })
    @Field(() => ID, { nullable: true })
    editedById: number;

}