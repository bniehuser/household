import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Household } from './Household';
import { Member } from './Member';
import { Role } from './Role';
import { BaseModel } from '../_common/BaseModel';
import { MembershipPermission } from './MembershipPermission';
import { Authorized, Field, ObjectType } from "type-graphql/dist";
import { PermissionType } from '../../../../@common/types/permission';

@ObjectType()
export class PermissionValue {
    @Field()
    key: string;
    @Field()
    value: number;
}

@Entity()
@ObjectType()
export class HouseholdMembership extends BaseModel {
    @ManyToOne(() => Household, household => household.memberships)
    @Field(() => Household)
    household: Household;

    @Column()
    @Field()
    householdId: number;

    @ManyToOne(() => Member, member => member.memberships)
    @Field(() => Member)
    member: Member;

    @Column()
    memberId: number;

    @ManyToOne(() => Role, { eager: true })
    @Field(() => Role)
    role: Role;

    @Column()
    @Field()
    roleId: number;

    @OneToMany(() => MembershipPermission, membershipPermission => membershipPermission.membership, { eager: true })
    membershipPermissions: MembershipPermission[];

    @Field(() => [PermissionValue])
    get permissions(): PermissionValue[] {
        const permissions = this.role.permissions.map(p => {
            const pv = new PermissionValue;
            pv.key = p.permission.key;
            pv.value = p.value;
            return pv;
        });
        this.membershipPermissions.forEach(p => {
            let tp: PermissionValue;
            if(tp = permissions.find(pv => pv.key === p.permission.key)) {
                tp.value = p.value;
            } else {
                tp = new PermissionValue();
                tp.key = p.permission.key;
                tp.value = p.value;
                permissions.push(tp)
            }
        });
        return permissions;
    }

    get isSuperAdmin() {
        return this.permissions.some(p => p.key === 'SUPER_ADMIN');
    }

    permissionFor(key: string) {
        return this.permissions.reduce((a, c) => c.key === key ? c.value : a, PermissionType.NONE);
    }

    hasPermission(key: string, value: number) {
        return this.permissionFor(key) >= value;
    }

}