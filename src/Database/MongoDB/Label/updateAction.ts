import { MongoClient } from "mongodb";
import MongoDBConfig from "../MongoDBConfig";
import DatabaseErrors from "../../DatabaseErrors";
import { UpdateLabelAction } from "../../LabelActions";

const updateAction =
  ({ url, database, collections }: MongoDBConfig): UpdateLabelAction =>
  (id, label) => {
    const client = new MongoClient(url);
    return client
      .connect()
      .then((client) => client.db(database))
      .then((db) => db.collection(collections.label))
      .then((collection) => collection.updateOne({ _id: id }, { $set: label }))
      .then((result) =>
        result !== null
          ? Promise.resolve(undefined)
          : Promise.reject(DatabaseErrors.NotFound)
      )
      .finally(() => client.close());
  };
export default updateAction;
