import LinkActions from "../../LinkActions";
import MongoDBConfig from "../MongoDBConfig";
import createAction from "./createAction";
import { deleteAction } from "./deleteAction";
import findAction from "./findAction";
import readAction from "./readAction";
import updateAction from "./updateAction";

const linkProvider = (config: MongoDBConfig): LinkActions => ({
  create: createAction(config),
  read: readAction(config),
  update: updateAction(config),
  delete: deleteAction(config),
  find: findAction,
});
export default linkProvider;
