import { Column, Entity } from 'typeorm';
import { Category } from '../_common/Category';

// @Entity()
export class AccountType extends Category<AccountType> {
    @Column()
    name: string;

    industry: string;
}