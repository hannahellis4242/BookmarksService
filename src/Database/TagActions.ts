import { ObjectId } from "mongodb";
import Label from "../Model/Label";
import Link from "../Model/Link";
import Tag from "../Model/Tag";

export type CreateTagAction = (tag: Tag) => Promise<ObjectId>;
export type ReadTagAction = (id: ObjectId) => Promise<Tag>;
export type UpdateTagAction = (id: ObjectId, tag: Tag) => Promise<void>;
export type DeleteTagAction = (id: ObjectId) => Promise<void>;
export type FindTagAction = (tag: Tag) => Promise<ObjectId>;
export type FindTagsWithLinkAction = (link: Link) => Promise<Tag[]>;
export type FindTagsWithLabelAction = (label: Label) => Promise<Tag[]>;

export default interface TagActions {
  create: CreateTagAction;
  read: ReadTagAction;
  update: UpdateTagAction;
  delete: DeleteTagAction;
  find: FindTagAction;
  findAllWithLink: FindTagsWithLinkAction;
  findAllWithLabel: FindTagsWithLabelAction;
}
