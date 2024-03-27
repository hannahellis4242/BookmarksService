import getConfig from "./Config/getConfig";
import { exit } from "process";
import MongoDBService from "./Service/MongoDBService";
import createApp from "./app";
import ServiceHandler from "./Handlers/ServiceHandler";
import DatabaseActions from "./Database/DatabaseActions";
import MongoDBProvider from "./Database/MongoDB/MongoDBProvider";
import MongoDBConfig from "./Database/MongoDB/MongoDBConfig";

(async () =>
  getConfig()
    .then((config) => {
      const service = new MongoDBService(config.databaseHost, "bookmarks", {
        link: "links",
        label: "labels",
        tag: "tag",
      });
      const handler = new ServiceHandler(service);
      const mongodbConfig: MongoDBConfig = {
        url: `mongodb://${config.databaseHost}:27017`,
        database: "bookmarks",
        collections: { link: "links", label: "labels" },
      };
      const dbActions: DatabaseActions = MongoDBProvider(mongodbConfig);
      createApp(dbActions)(service, handler).listen(
        config.port,
        "0.0.0.0",
        () => console.log(`listening on port ${config.port}`)
      );
    })
    .catch((reason) => {
      console.error(reason);
      exit(1);
    }))();
