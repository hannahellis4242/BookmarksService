import { ObjectId } from "mongodb";
import Label from "../Model/Label";

export type CreateLabelAction = (label: Label) => Promise<ObjectId>;
export type ReadLabelAction = (id: ObjectId) => Promise<Label>;
export type UpdateLabelAction = (id: ObjectId, label: Label) => Promise<void>;
export type DeleteLabelAction = (id: ObjectId) => Promise<void>;
export type FindLabelAction = (label: Label) => Promise<ObjectId>;

export default interface LabelActions {
  create: CreateLabelAction;
  read: ReadLabelAction;
  update: UpdateLabelAction;
  delete: DeleteLabelAction;
  find: FindLabelAction;
}
