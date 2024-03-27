import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import LinkService from "../Service/LinkService";
import readBody from "./utils/readBody";
import readQuery from "./utils/readQuery";
import handleError, { Errors } from "./utils/handleErrors";
import Handler from "../Handlers/Handler";
import { makeLink } from "../Model/Adaptor";
import LinkActions from "../Database/LinkActions";
import readParam from "./utils/readParam";
import { ObjectId } from "mongodb";

const link = (actions: LinkActions) => {
  const router = Router();
  router.post("/", (req, res) =>
    readBody(req, "link", Errors.NoLink)
      .then(makeLink) //move to model world
      .then(actions.create) //perform db action
      .then((id) => res.status(StatusCodes.CREATED).json(id))
      .catch(handleError(res))
  );
  router.get("/id", (req, res) =>
    readQuery(req, "link", Errors.NoLink)
      .then(makeLink)
      .then(actions.find)
      .then((id) => res.json(id))
      .catch(handleError(res))
  );
  router.get("/:id", (req, res) =>
    readParam(req, "id", Errors.NoIDParam)
      .then((id) => new ObjectId(id))
      .then(actions.read)
      .then((id) => res.json(id))
      .catch(handleError(res))
  );
  router.put("/:id", (req, res) =>
    readParam(req, "id", Errors.NoIDParam)
      .then((id) =>
        readBody(req, "link", Errors.NoLink).then((link) => ({ id, link }))
      )
      .then(({ id, link }) => ({
        id: new ObjectId(id),
        link: makeLink(link),
      }))
      .then(({ id, link }) => actions.update(id, link))
      .then(() => res.sendStatus(StatusCodes.OK))
      .catch(handleError(res))
  );
  router.delete("/:id", (req, res) =>
    readParam(req, "id", Errors.NoIDParam)
      .then((id) => new ObjectId(id))
      .then(actions.delete)
      .then(() => res.sendStatus(StatusCodes.OK))
      .catch(handleError(res))
  );
  return router;
};

export default link;
