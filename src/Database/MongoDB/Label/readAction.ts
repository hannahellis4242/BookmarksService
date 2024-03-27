import { MongoClient } from "mongodb";
import MongoDBConfig from "../MongoDBConfig";
import DatabaseErrors from "../../DatabaseErrors";
import { ReadLabelAction } from "../../LabelActions";
import Label from "../../../Model/Label";

const readAction =
  ({ url, database, collections }: MongoDBConfig): ReadLabelAction =>
  (id) => {
    const client = new MongoClient(url);
    return client
      .connect()
      .then((client) => client.db(database))
      .then((db) => db.collection(collections.label))
      .then((collection) => collection.findOne<Label>({ _id: id }))
      .then((existing) =>
        existing !== null
          ? Promise.resolve({ label: existing.label })
          : Promise.reject(DatabaseErrors.NotFound)
      )
      .finally(() => client.close());
  };
export default readAction;
