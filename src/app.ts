import express, { json } from "express";
import Service from "./Service/Service";
import morgan from "morgan";
import all from "./Routes/all";
import label from "./Routes/label";
import link from "./Routes/link";
import tag from "./Routes/tag";

const createApp = (service: Service) => {
  const app = express();
  app.use(morgan("combined"));
  app.use(json());

  app.use("/label", label(service));
  app.use("/link", link(service));
  app.use("/tag", tag(service));
  app.use("/all", all(service));

  return app;
};

export default createApp;
