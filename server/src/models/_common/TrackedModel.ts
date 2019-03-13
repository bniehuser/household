import { Column } from "typeorm";
import { TimedModel } from "./TimedModel";
import { Editor } from "./fields/Editor";

export abstract class TrackedModel extends TimedModel {
    @Column(type=>Editor)
    editor: Editor;
}