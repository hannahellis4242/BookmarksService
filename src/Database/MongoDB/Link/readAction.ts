import { MongoClient } from "mongodb";
import { ReadLinkAction } from "../../LinkActions";
import MongoDBConfig from "../MongoDBConfig";
import Link from "../../../Model/Link";
import DatabaseErrors from "../../DatabaseErrors";

const readAction =
  ({ url, database, collections }: MongoDBConfig): ReadLinkAction =>
  (id) => {
    const client = new MongoClient(url);
    return client
      .connect()
      .then((client) => client.db(database))
      .then((db) => db.collection(collections.link))
      .then((collection) => collection.findOne<Link>({ _id: id }))
      .then((existing) =>
        existing !== null
          ? Promise.resolve({ link: existing.link })
          : Promise.reject(DatabaseErrors.NotFound)
      )
      .finally(() => client.close());
  };
export default readAction;
