import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import handleError, { Errors } from "./utils/handleErrors";
import readBody from "./utils/readBody";
import Handler from "../Handlers/Handler";

const tag = (handler: Handler) =>
  Router().post("/", (req, res) =>
    readBody(req, "link", Errors.NoLink)
      .then((link) =>
        readBody(req, "label", Errors.NoLabel).then((label) => [link, label])
      )
      .then(([link, label]) => handler.createTag(link, label))
      .then(() => res.sendStatus(StatusCodes.CREATED))
      .catch(handleError(res))
  );

export default tag;
