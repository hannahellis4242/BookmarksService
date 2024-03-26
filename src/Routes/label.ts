import { Router } from "express";
import LabelService from "../Service/LabelService";
import handleError, { Errors } from "./utils/handleErrors";
import readQuery from "./utils/readQuery";
import Handler from "../Handlers/Handler";

const label = (service: LabelService, handler: Handler) => {
  const router = Router();
  router.get("/all", (_, res) =>
    service
      .allLabels()
      .then((labels) => Promise.all(labels.map((id) => service.getLabel(id))))
      .then((labels) => labels.map(({ label }) => label))
      .then((labels) => res.json(labels))
      .catch(handleError(res))
  );
  router.get("/tagged", (req, res) =>
    readQuery(req, "link", Errors.NoLink)
      .then((link) => handler.readLinkLabels(link))
      .then((labels) => res.json(labels))
      .catch(handleError(res))
  );
  return router;
};

export default label;
