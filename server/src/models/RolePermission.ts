import { Column, Entity, ManyToOne } from 'typeorm';
import { TrackedModel } from './_common/TrackedModel';
import { Permission } from './Permission';
import { Role } from './Role';

@Entity()
export class RolePermission extends TrackedModel {
    @ManyToOne(() => Role, role => role.permissions)
    role: Role;

    @ManyToOne(() => Permission)
    permission: Permission;

    @Column('integer')
    value: number;
}