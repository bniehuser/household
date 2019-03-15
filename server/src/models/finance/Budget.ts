import { Column, Entity } from "typeorm";
import { TrackedModel } from "../_common/TrackedModel";

@Entity()
export class Budget extends TrackedModel {
    @Column()
    name: string;

    @Column('timestamptz')
    effectiveAt: Date;

}