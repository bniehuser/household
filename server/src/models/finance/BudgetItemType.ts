import { Column, Entity } from 'typeorm';
import { Category } from '../_common/Category';

// @Entity()
export class BudgetItemType extends Category<BudgetItemType> {
    @Column()
    name: string;
}