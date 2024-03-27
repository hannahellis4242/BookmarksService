import DatabaseActions from "../DatabaseActions";
import LabelActions from "../LabelActions";
import LinkActions from "../LinkActions";
import TagActions from "../TagActions";
import {
  createTag,
  deleteTag,
  findTag,
  findTagsWithLabel,
  findTagsWithLink,
  readTag,
  updateTag,
} from "./Actions";
import labelProvider from "./Label/labelProvider";
import linkProvider from "./Link/linkProvider";
import MongoDBConfig from "./MongoDBConfig";

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
