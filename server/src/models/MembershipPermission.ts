import { Column, Entity, ManyToOne } from 'typeorm';
import { TrackedModel } from './_common/TrackedModel';
import { HouseholdMembership } from './HouseholdMembership';
import { Permission } from './Permission';
import { PermissionType } from "@common/types/permission";
import { ObjectType } from "type-graphql/dist";

@Entity()
export class MembershipPermission extends TrackedModel {
    @ManyToOne(() => HouseholdMembership, membership => membership.membershipPermissions)
    membership: HouseholdMembership;

    @ManyToOne(() => Permission, { eager: true })
    permission: Permission;

    @Column('integer')
    value: PermissionType;
}