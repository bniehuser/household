import { Category } from "../_common/Category";
import { Entity } from "typeorm";

@Entity()
export class BudgetItemType extends Category {

}

const bi = new BudgetItemType();

const c: BudgetItemType = bi.children;
