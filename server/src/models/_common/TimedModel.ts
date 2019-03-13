import { BaseModel } from "./BaseModel";
import { Timestamps } from "./fields/Timestamps";
import { Column } from "typeorm";

export abstract class TimedModel extends BaseModel {
    @Column(type=>Timestamps)
    time: Timestamps;
}