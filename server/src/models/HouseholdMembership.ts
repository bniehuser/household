import { Entity, ManyToOne, OneToMany } from 'typeorm';
import { Household } from './Household';
import { Member } from './Member';
import { Role } from './Role';
import { BaseModel } from './_common/BaseModel';
import { MembershipPermission } from './MembershipPermission';

@Entity()
export class HouseholdMembership extends BaseModel {
    @ManyToOne(() => Household, household => household.memberships)
    household: Household;

    @ManyToOne(() => Member, member => member.memberships)
    member: Member;

    @ManyToOne(() => Role)
    role: Role;

    @OneToMany(() => MembershipPermission, membershipPermission => membershipPermission.membership)
    membershipPermissions: MembershipPermission[];

    get permissions(): { [key: string]: number } {
        if(!this.role || this.role.permissions === undefined || this.membershipPermissions === undefined) {
            throw new Error("Not enough information loaded to request permissions");
        }
        return Object.assign(
            {},
            this.role.permissions.reduce((a, c) => { a[c.permission.key] = c.value; return a; }, {} as { [key: string]: number }),
            this.membershipPermissions.reduce((a, c) => { a[c.permission.key] = c.value; return a; }, {} as { [key: string]: number })
        );
    }

}