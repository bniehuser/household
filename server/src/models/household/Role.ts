import { TrackedModel } from '../_common/TrackedModel';
import { Column, Entity, OneToMany } from 'typeorm';
import { RolePermission } from './RolePermission';
import { Field, ObjectType } from "type-graphql/dist";

@Entity()
@ObjectType()
export class Role extends TrackedModel {
    @Column()
    @Field()
    name: string;

    @OneToMany(() => RolePermission, permission => permission.role, { eager: true })
    permissions: RolePermission[];
}