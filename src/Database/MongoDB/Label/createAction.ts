import { MongoClient } from "mongodb";
import MongoDBConfig from "../MongoDBConfig";
import DatabaseErrors from "../../DatabaseErrors";
import { CreateLabelAction } from "../../LabelActions";

const createAction =
  ({ url, database, collections }: MongoDBConfig): CreateLabelAction =>
  (label) => {
    const client = new MongoClient(url);
    return client
      .connect()
      .then((client) => client.db(database))
      .then((db) => db.collection(collections.label))
      .then((collection) =>
        collection.findOne(label).then((existing) => ({ collection, existing }))
      )
      .then(({ collection, existing }) =>
        existing === null
          ? Promise.resolve(collection)
          : Promise.reject(DatabaseErrors.AlreadyExists)
      )
      .then((collection) => collection.insertOne(label))
      .then((doc) => doc.insertedId)
      .catch((error) => {
        return error === DatabaseErrors.AlreadyExists
          ? Promise.reject(DatabaseErrors.AlreadyExists)
          : Promise.reject(DatabaseErrors.DBError);
      })
      .finally(() => client.close());
  };

export default createAction;
