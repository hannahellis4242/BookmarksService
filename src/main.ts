import getConfig from "./Config/getConfig";
import { exit } from "process";
import MongoDBService from "./Service/MongoDBService";
import createApp from "./app";
import ServiceHandler from "./Handlers/ServiceHandler";

(async () =>
  getConfig()
    .then((config) => {
      const service = new MongoDBService(config.databaseHost, "bookmarks", {
        link: "links",
        label: "labels",
        tag: "tag",
      });
      const handler = new ServiceHandler(service);
      createApp(service, handler).listen(config.port, "0.0.0.0", () =>
        console.log(`listening on port ${config.port}`)
      );
    })
    .catch((reason) => {
      console.error(reason);
      exit(1);
    }))();
