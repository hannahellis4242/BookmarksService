import { MongoClient } from "mongodb";
import { UpdateLinkAction } from "../../LinkActions";
import MongoDBConfig from "../MongoDBConfig";
import DatabaseErrors from "../../DatabaseErrors";

const updateAction =
  ({ url, database, collections }: MongoDBConfig): UpdateLinkAction =>
  (id, link) => {
    const client = new MongoClient(url);
    return client
      .connect()
      .then((client) => client.db(database))
      .then((db) => db.collection(collections.link))
      .then((collection) => collection.updateOne({ _id: id }, { $set: link }))
      .then((result) =>
        result !== null
          ? Promise.resolve(undefined)
          : Promise.reject(DatabaseErrors.NotFound)
      )
      .finally(() => client.close());
  };
export default updateAction;
