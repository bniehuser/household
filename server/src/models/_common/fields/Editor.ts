import { ManyToOne } from "typeorm";
import { Member } from '../../Member';

export class Editor {
    @ManyToOne(() => Member)
    createdBy: Member;

    @ManyToOne(() => Member)
    editedBy: Member;
}