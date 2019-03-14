import { Column, Entity } from 'typeorm';
import { TimedModel } from './_common/TimedModel';

@Entity()
export class Permission extends TimedModel {
    @Column()
    key: string;
}