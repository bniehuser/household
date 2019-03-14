import { TrackedModel } from "./_common/TrackedModel";
import { Column, Entity, OneToMany } from "typeorm";
import { HouseholdMembership } from './HouseholdMembership';

@Entity()
export class Member extends TrackedModel {

    @Column({ nullable: true })
    firstName: string;

    @Column({ nullable: true })
    lastName: string;

    @Column({ nullable: true })
    alias: string;

    @Column('text')
    email: string;

    @Column('text')
    password: string; // should ALWAYS be hashed before we see it here, no plaintext pw's please!

    @OneToMany(() => HouseholdMembership, membership => membership.member)
    memberships: HouseholdMembership[];

}