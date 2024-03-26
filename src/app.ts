import express, { json } from "express";
import Service from "./Service/Service";
import morgan from "morgan";
import all from "./Routes/all";
import label from "./Routes/label";
import link from "./Routes/link";
import tag from "./Routes/tag";
import Handler from "./Handlers/Handler";

const createApp = (service: Service, handler: Handler) => {
  const app = express();
  app.use(morgan("combined"));
  app.use(json());

  app.use("/label", label(service, handler));
  app.use("/link", link(service, handler));
  app.use("/tag", tag(handler));
  app.use("/all", all(service));

  return app;
};

export default createApp;
