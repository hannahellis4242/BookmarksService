import LabelActions from "../../LabelActions";
import MongoDBConfig from "../MongoDBConfig";
import createAction from "./createAction";
import { deleteAction } from "./deleteAction";
import findAction from "./findAction";
import readAction from "./readAction";
import updateAction from "./updateAction";

const labelProvider = (config: MongoDBConfig): LabelActions => ({
  create: createAction(config),
  read: readAction(config),
  update: updateAction(config),
  delete: deleteAction(config),
  find: findAction(config),
});
export default labelProvider;
