import { Column, Timestamp } from "typeorm";

export class Timestamps {
    @Column(type=>Timestamp)
    createdAt: Date;
    @Column(type=>Timestamp)
    updatedAt: Date;
}