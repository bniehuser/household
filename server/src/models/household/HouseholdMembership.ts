import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Household } from './Household';
import { Member } from './Member';
import { Role } from './Role';
import { BaseModel } from '../_common/BaseModel';
import { MembershipPermission } from './MembershipPermission';
import { Field, ObjectType } from "type-graphql/dist";

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

}