import { TrackedModel } from "./TrackedModel";
import { ManyToOne, OneToMany } from "typeorm";

export abstract class Category extends TrackedModel {

    @ManyToOne(() => Category, category => category.children)
    parent: Category;

    @OneToMany(() => Category, category => category.parent)
    children: Category[];

}