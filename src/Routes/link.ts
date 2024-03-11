import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import ServiceErrors from "../Service/ServiceErrors";
import LinkService from "../Service/LinkService";
import readBody from "./utils/readBody";
import readQuery from "./utils/readQuery";
import handleError, { Errors } from "./utils/handleErrors";

const link = (service: LinkService) =>
  Router()
    .post("/", (req, res) =>
      readBody(req, "link", Errors.NoLink)
        .then((link) => service.saveLink({link}))
        .then((id) => res.status(StatusCodes.CREATED).json(id.value))
        .catch(handleError(res))
    )
    .get("/", (req, res) =>
      readQuery(req, "link", Errors.NoLink)
        .then((link) => service.getLinkID({link}))
        .then((id) => res.json(id.value))
        .catch(handleError(res))
    )
    .delete("/", (req, res) =>
      readQuery(req, "link", Errors.NoLink)
        .then((link) => service.getLinkID({link}))
        .then((id) => service.removeLink(id))
        .then(() => res.sendStatus(StatusCodes.OK))
        .catch(handleError(res))
    )

export default link;
