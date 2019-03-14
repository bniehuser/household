import { BaseModel } from "./BaseModel";
import { CreateDateColumn, UpdateDateColumn } from "typeorm";

export abstract class TimedModel extends BaseModel {

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}