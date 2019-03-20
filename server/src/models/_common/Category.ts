import { TrackedModel } from "./TrackedModel";
import { ManyToOne, OneToMany } from "typeorm";

export abstract class Category<T> extends TrackedModel {

    @ManyToOne(() => Category, category => category.children)
    parent: T;

    @OneToMany(() => Category, category => category.parent)
    children: T[];

}