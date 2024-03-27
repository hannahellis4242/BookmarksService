import { MongoClient } from "mongodb";
import { CreateLinkAction } from "../../LinkActions";
import MongoDBConfig from "../MongoDBConfig";
import DatabaseErrors from "../../DatabaseErrors";

const createAction =
  ({ url, database, collections }: MongoDBConfig): CreateLinkAction =>
  (link) => {
    const client = new MongoClient(url);
    return client
      .connect()
      .then((client) => client.db(database))
      .then((db) => db.collection(collections.link))
      .then((collection) =>
        collection.findOne(link).then((existing) => ({ collection, existing }))
      )
      .then(({ collection, existing }) =>
        existing === null
          ? Promise.resolve(collection)
          : Promise.reject(DatabaseErrors.AlreadyExists)
      )
      .then((collection) => collection.insertOne(link))
      .then((doc) => doc.insertedId)
      .catch((error) => {
        return error === DatabaseErrors.AlreadyExists
          ? Promise.reject(DatabaseErrors.AlreadyExists)
          : Promise.reject(DatabaseErrors.DBError);
      })
      .finally(() => client.close());
  };

export default createAction;
