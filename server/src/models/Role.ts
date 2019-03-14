import { TrackedModel } from './_common/TrackedModel';
import { Column, Entity, OneToMany } from 'typeorm';
import { RolePermission } from './RolePermission';

@Entity()
export class Role extends TrackedModel {
    @Column()
    name: string;

    @OneToMany(() => RolePermission, permission => permission.role)
    permissions: RolePermission[];
}