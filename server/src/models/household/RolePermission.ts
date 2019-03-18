import { Column, Entity, ManyToOne } from 'typeorm';
import { TrackedModel } from '../_common/TrackedModel';
import { Permission } from './Permission';
import { Role } from './Role';
import { PermissionType } from "@common/types/permission";

@Entity()
export class RolePermission extends TrackedModel {
    @ManyToOne(() => Role, role => role.permissions)
    role: Role;

    @ManyToOne(() => Permission, { eager: true })
    permission: Permission;

    @Column('integer')
    value: PermissionType;
}