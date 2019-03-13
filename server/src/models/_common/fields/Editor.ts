import { Column, Timestamp } from "typeorm";

export class Editor {
    @Column(type=>Member)
    createdBy: Member;
    @Column(type=>Member)
    editedBy: Member;
}