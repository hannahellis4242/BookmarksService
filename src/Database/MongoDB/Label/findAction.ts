import { MongoClient } from "mongodb";
import MongoDBConfig from "../MongoDBConfig";
import DatabaseErrors from "../../DatabaseErrors";
import { FindLabelAction } from "../../LabelActions";

const findAction =
  ({ url, database, collections }: MongoDBConfig): FindLabelAction =>
  (label) => {
    const client = new MongoClient(url);
    return client
      .connect()
      .then((client) => client.db(database))
      .then((db) => db.collection(collections.label))
      .then((collection) => collection.findOne(label))
      .then((existing) =>
        existing !== null
          ? Promise.resolve(existing._id)
          : Promise.reject(DatabaseErrors.NotFound)
      )
      .finally(() => client.close());
  };
export default findAction;
