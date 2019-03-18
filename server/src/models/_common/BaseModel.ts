import { PrimaryGeneratedColumn } from "typeorm";
import { Field, ID } from "type-graphql/dist";

export abstract class BaseModel {

    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id: number;

}