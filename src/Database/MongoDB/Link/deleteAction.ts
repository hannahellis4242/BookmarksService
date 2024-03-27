import { MongoClient } from "mongodb";
import { DeleteLinkAction } from "../../LinkActions";
import MongoDBConfig from "../MongoDBConfig";
import DatabaseErrors from "../../DatabaseErrors";

export const deleteAction =
  ({ url, database, collections }: MongoDBConfig): DeleteLinkAction =>
  (id) => {
    const client = new MongoClient(url);
    return client
      .connect()
      .then((client) => client.db(database))
      .then((db) => db.collection(collections.link))
      .then((collection) => collection.deleteOne({ _id: id }))
      .then((found) =>
        found
          ? Promise.resolve(undefined)
          : Promise.reject(DatabaseErrors.NotFound)
      )
      .finally(() => client.close());
  };
