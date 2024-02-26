import express, { json } from "express";
import getConfig from "./Config/getConfig";
import { exit } from "process";
import MongoDBService from "./Service/MongoDBService";
import link from "./Routes/link";
import tag from "./Routes/tag";
import label from "./Routes/label";
import all from "./Routes/all";

(async () =>
  getConfig()
    .then((config) => {
      const service = new MongoDBService(config.databaseHost, "bookmarks", {
        link: "links",
        label: "labels",
        tag: "tag",
      });
      const app = express();
      app.use(json());

      app.use("/label",label(service));
      app.use("/link", link(service));
      app.use("/tag",tag(service));
      app.use("/all",all(service));

      app.listen(config.port, "0.0.0.0", () =>
        console.log(`listening on port ${config.port}`)
      );
    })
    .catch((reason) => {
      console.error(reason);
      exit(1);
    }))();
