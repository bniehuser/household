import { Column, Entity, OneToMany } from 'typeorm';
import { TrackedModel } from './_common/TrackedModel';
import { HouseholdMembership } from './HouseholdMembership';

@Entity()
export class Household extends TrackedModel {

    @Column()
    name: string;

    @Column('text')
    motto: string;

    @Column('text')
    description: string;

    @OneToMany(() => HouseholdMembership, member => member.household)
    memberships: HouseholdMembership[];

}