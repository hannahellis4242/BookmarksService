import express, { json } from "express";
import Service from "./Service/Service";
import morgan from "morgan";
import all from "./Routes/all";
import label from "./Routes/label";
import link from "./Routes/link";
import tag from "./Routes/tag";
import Handler from "./Handlers/Handler";
import DatabaseActions from "./Database/DatabaseActions";

const createApp =
  (dbActions: DatabaseActions) => (service: Service, handler: Handler) => {
    const app = express();
    app.use(morgan("combined"));
    app.use(json());

    app.use("/label", label(dbActions.label));
    app.use("/link", link(dbActions.link));
    app.use("/tag", tag(handler));
    app.use("/all", all(service));

    return app;
  };

export default createApp;
