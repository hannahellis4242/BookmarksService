import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import ServiceErrors from "../Service/ServiceErrors";
import LinkService from "../Service/LinkService";
import readQuery from "./utils/readQuery";
import LabelService from "../Service/LabelService";
import TagService from "../Service/TagService";
import handleError, { Errors } from "./utils/handleErrors";
import readBody from "./utils/readBody";

const tag = (service: LabelService & LinkService & TagService) =>
  Router()
    .post("/", (req, res) =>
      readBody(req, "link", Errors.NoLink)
        .then((link) => ({ link }))
        .then((link) =>
          service
            .saveLink(link)
            .catch((e) =>
              e === ServiceErrors.AlreadyExists
                ? service.getLinkID(link)
                : Promise.reject(e)
            )
        )
        .then((linkId) =>
          readBody(req, "label", Errors.NoLabel)
            .then((label) => ({ label }))
            .then((label) =>
              service
                .saveLabel(label)
                .catch((e) =>
                  e === ServiceErrors.AlreadyExists
                    ? service.getLabelID(label)
                    : Promise.reject(e)
                )
            )
            .then((labelId) => ({ linkId, labelId }))
        )
        .then(({ linkId, labelId }) => service.saveTag(linkId, labelId))
        .then((id) => res.status(StatusCodes.CREATED).send(id.value))
        .catch(handleError(res))
    )
    .get("/:label", (req, res) => {
      const { label } = req.params;
      return service
        .getLabelID({ label })
        .then((labelID) => service.findTagsWithLabel(labelID))
        .then((labelIds) =>
          Promise.all(labelIds.map((labelId) => service.getTagLinkID(labelId)))
        )
        .then((linkIds) =>
          Promise.all(linkIds.map((link) => service.getLink(link)))
        )
        .then((links) => links.map(({ link }) => link))
        .then((links) => res.json(links))
        .catch(handleError(res));
    })
    .get("/", (req, res) =>
      readQuery(req, "link", Errors.NoLink)
        .then((link) => service.getLinkID({ link }))
        .then((linkId) => service.findTagsWithLink(linkId))
        .then((labelIds) =>
          Promise.all(labelIds.map((labelId) => service.getTagLabelID(labelId)))
        )
        .then((labelIds) =>
          Promise.all(labelIds.map((labelId) => service.getLabel(labelId)))
        )
        .then((labels) => labels.map(({ label }) => label))
        .then((labels) => res.json(labels))
        .catch(handleError(res))
    );

export default tag;
