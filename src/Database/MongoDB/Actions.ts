import {
  CreateLabelAction,
  ReadLabelAction,
  UpdateLabelAction,
  DeleteLabelAction,
  FindLabelAction,
} from "../LabelActions";
import {
  CreateTagAction,
  ReadTagAction,
  UpdateTagAction,
  DeleteTagAction,
  FindTagAction,
  FindTagsWithLinkAction,
  FindTagsWithLabelAction,
} from "../TagActions";

export const createLabel: CreateLabelAction = (label) => Promise.reject("TODO");
export const readLabel: ReadLabelAction = (id) => Promise.reject("TODO");
export const updateLabel: UpdateLabelAction = (id, label) =>
  Promise.reject("TODO");
export const deleteLabel: DeleteLabelAction = (id) => Promise.reject("TODO");
export const findLabel: FindLabelAction = (label) => Promise.reject("TODO");

export const createTag: CreateTagAction = (tag) => Promise.reject("TODO");
export const readTag: ReadTagAction = (id) => Promise.reject("TODO");
export const updateTag: UpdateTagAction = (id, tag) => Promise.reject("TODO");
export const deleteTag: DeleteTagAction = (id) => Promise.reject("TODO");
export const findTag: FindTagAction = (tag) => Promise.reject("TODO");

export const findTagsWithLink: FindTagsWithLinkAction = (link) =>
  Promise.reject("TODO");
export const findTagsWithLabel: FindTagsWithLabelAction = (label) =>
  Promise.reject("TODO");
