import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import readBody from "./utils/readBody";
import readQuery from "./utils/readQuery";
import handleError, { Errors } from "./utils/handleErrors";
import { makeLabel } from "../Model/Adaptor";
import readParam from "./utils/readParam";
import { ObjectId } from "mongodb";
import LabelActions from "../Database/LabelActions";

const label = (actions: LabelActions) => {
  const router = Router();
  router.post("/", (req, res) =>
    readBody(req, "label", Errors.NoLabel)
      .then(makeLabel) //move to model world
      .then(actions.create) //perform db action
      .then((id) => res.status(StatusCodes.CREATED).json(id))
      .catch(handleError(res))
  );
  router.get("/id", (req, res) =>
    readQuery(req, "label", Errors.NoLabel)
      .then(makeLabel)
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
        readBody(req, "label", Errors.NoLabel).then((label) => ({ id, label }))
      )
      .then(({ id, label }) => ({
        id: new ObjectId(id),
        label: makeLabel(label),
      }))
      .then(({ id, label }) => actions.update(id, label))
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

export default label;
