import { Column, Entity, ManyToOne } from 'typeorm';
import { TrackedModel } from './_common/TrackedModel';
import { HouseholdMembership } from './HouseholdMembership';
import { Permission } from './Permission';

@Entity()
export class MembershipPermission extends TrackedModel {
    @ManyToOne(() => HouseholdMembership, membership => membership.membershipPermissions)
    membership: HouseholdMembership;

    @ManyToOne(() => Permission)
    permission: Permission;

    @Column('integer')
    value: number;
}