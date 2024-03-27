import DatabaseActions from "../DatabaseActions";
import LabelActions from "../LabelActions";
import LinkActions from "../LinkActions";
import TagActions from "../TagActions";
import {
  createLabel,
  createTag,
  deleteLabel,
  deleteTag,
  findLabel,
  findLink,
  findTag,
  findTagsWithLabel,
  findTagsWithLink,
  readLabel,
  readTag,
  updateLabel,
  updateTag,
} from "./Actions";
import linkProvider from "./Link/linkProvider";
import MongoDBConfig from "./MongoDBConfig";

const labelProvider = (config: MongoDBConfig): LabelActions => ({
  create: createLabel,
  read: readLabel,
  update: updateLabel,
  delete: deleteLabel,
  find: findLabel,
});

const tagProvider = (config: MongoDBConfig): TagActions => ({
  create: createTag,
  read: readTag,
  update: updateTag,
  delete: deleteTag,
  find: findTag,
  findAllWithLink: findTagsWithLink,
  findAllWithLabel: findTagsWithLabel,
});

const MongoDBProvider = (config: MongoDBConfig): DatabaseActions => {
  const link: LinkActions = linkProvider(config);
  const label: LabelActions = labelProvider(config);
  const tag: TagActions = tagProvider(config);
  return { link, label, tag };
};
export default MongoDBProvider;
