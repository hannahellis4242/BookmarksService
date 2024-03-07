import { Router } from "express";
import LabelService from "../Service/LabelService";
import handleError from "./utils/handleErrors";

const label = (service: LabelService) =>
  Router().get("/all", (req, res) =>
    service
      .allLabels()
      .then((labels) => Promise.all(labels.map((id) => service.getLabel(id))))
      .then((labels) => labels.map(({ label }) => label))
      .then((labels) => res.json(labels))
      .catch(handleError(res))
  );

export default label;
