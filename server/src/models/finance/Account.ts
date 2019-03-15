import { Column, Entity } from "typeorm";
import { TrackedModel } from "../_common/TrackedModel";

@Entity()
export class Account extends TrackedModel {
    @Column()
    name: string;
}