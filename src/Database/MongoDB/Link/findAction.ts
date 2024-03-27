import { FindLinkAction } from "../../LinkActions";
import { MongoClient, WithId } from "mongodb";
import MongoDBConfig from "../MongoDBConfig";
import Link from "../../../Model/Link";
import DatabaseErrors from "../../DatabaseErrors";

const findAction =
  ({ url, database, collections }: MongoDBConfig): FindLinkAction =>
  (link) => {
    const client = new MongoClient(url);
    return client
      .connect()
      .then((client) => client.db(database))
      .then((db) => db.collection(collections.link))
      .then((collection) => collection.findOne(link))
      .then((existing) =>
        existing !== null
          ? Promise.resolve(existing._id)
          : Promise.reject(DatabaseErrors.NotFound)
      )
      .finally(() => client.close());
  };
export default findAction;
