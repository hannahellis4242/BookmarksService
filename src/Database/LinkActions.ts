import { ObjectId } from "mongodb";
import Link from "../Model/Link";

export type CreateLinkAction = (link: Link) => Promise<ObjectId>;
export type ReadLinkAction = (id: ObjectId) => Promise<Link>;
export type UpdateLinkAction = (id: ObjectId, link: Link) => Promise<void>;
export type DeleteLinkAction = (id: ObjectId) => Promise<void>;
export type FindLinkAction = (link: Link) => Promise<ObjectId>;

export default interface LinkActions {
  create: CreateLinkAction;
  read: ReadLinkAction;
  update: UpdateLinkAction;
  delete: DeleteLinkAction;
  find: FindLinkAction;
}
