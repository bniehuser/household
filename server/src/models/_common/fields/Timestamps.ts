import { CreateDateColumn, UpdateDateColumn } from "typeorm";

export class Timestamps {

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}