import { Router } from "express";
import LinkService from "../Service/LinkService";
import LabelService from "../Service/LabelService";
import TagService from "../Service/TagService";
import handleError, { Errors } from "./utils/handleErrors";
import Bookmark from "../Model/Bookmark";

const all = (service: LabelService & LinkService & TagService) =>
  Router()
    .get("/", (_, res) =>
      service
        .allLinks()
        .then((linkIds) =>
          Promise.all(
            linkIds.map((linkId) =>
              service
                .getLink(linkId)
                .then(({ link }) =>
                  service.findTagsWithLink(linkId).then((tags) =>
                    Promise.all(
                      tags.map((tag) =>
                        service
                          .getTagLabelID(tag)
                          .then((labelID) => service.getLabel(labelID))
                      )
                    )
                      .then((labels) => labels.map(({ label }) => label))
                      .then((labels) => ({ link, labels }))
                  )
                )
            )
          )
        )
        .then((bookmarks: Bookmark[]) => res.json(bookmarks))
        .catch(handleError(res))
    )

export default all;
