import { Column, ManyToOne } from "typeorm";
import { TimedModel } from "./TimedModel";
import { Member } from '../Member';

export abstract class TrackedModel extends TimedModel {
    @ManyToOne(() => Member)
    createdBy: Member;

    @Column({ nullable: true })
    createdById: number;

    @ManyToOne(() => Member)
    editedBy: Member;

    @Column({ nullable: true })
    editedById: number;

}