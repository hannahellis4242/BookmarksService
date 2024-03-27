import { MongoClient } from "mongodb";
import MongoDBConfig from "../MongoDBConfig";
import DatabaseErrors from "../../DatabaseErrors";
import { DeleteLabelAction } from "../../LabelActions";

export const deleteAction =
  ({ url, database, collections }: MongoDBConfig): DeleteLabelAction =>
  (id) => {
    const client = new MongoClient(url);
    return client
      .connect()
      .then((client) => client.db(database))
      .then((db) => db.collection(collections.label))
      .then((collection) => collection.deleteOne({ _id: id }))
      .then(({ deletedCount }) =>
        deletedCount === 1
          ? Promise.resolve(undefined)
          : Promise.reject(DatabaseErrors.NotFound)
      )
      .finally(() => client.close());
  };
