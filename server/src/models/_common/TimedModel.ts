import { BaseModel } from "./BaseModel";
import { CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Field } from "type-graphql/dist";

export abstract class TimedModel extends BaseModel {

    @CreateDateColumn()
    @Field(() => Date)
    createdAt: Date;

    @UpdateDateColumn()
    @Field(() => Date)
    updatedAt: Date;

}