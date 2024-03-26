import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import LinkService from "../Service/LinkService";
import readBody from "./utils/readBody";
import readQuery from "./utils/readQuery";
import handleError, { Errors } from "./utils/handleErrors";
import Handler from "../Handlers/Handler";

const link = (service: LinkService, handler: Handler) => {
  const router = Router();
  router.get("/tagged", (req, res) =>
    readQuery(req, "label", Errors.NoLabel)
      .then((label) => handler.readLabelLinks(label))
      .then((links) => res.json(links))
      .catch(handleError(res))
  );
  router.post("/", (req, res) =>
    readBody(req, "link", Errors.NoLink)
      .then((link) => service.saveLink({ link }))
      .then((id) => res.status(StatusCodes.CREATED).json(id.value))
      .catch(handleError(res))
  );
  router.get("/", (req, res) =>
    readQuery(req, "link", Errors.NoLink)
      .then((link) => service.getLinkID({ link }))
      .then((id) => res.json(id.value))
      .catch(handleError(res))
  );
  router.delete("/", (req, res) =>
    readQuery(req, "link", Errors.NoLink)
      .then((link) => service.getLinkID({ link }))
      .then((id) => service.removeLink(id))
      .then(() => res.sendStatus(StatusCodes.OK))
      .catch(handleError(res))
  );
  return router;
};

export default link;
