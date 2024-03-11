import { Router } from "express";
import handleError, { Errors } from "./utils/handleErrors";
import Bookmark from "../Model/Bookmark";
import ServiceErrors from "../Service/ServiceErrors";
import Service from "../Service/Service";

const all = (service: Service) =>
  Router().get("/", (_, res) =>
    service
      .allLinks()
      .then((linkIds) =>
        Promise.all(
          linkIds.map((linkId) =>
            service.getLink(linkId).then(({ link }) =>
              service
                .findTagsWithLink(linkId)
                .catch((e) =>
                  e === ServiceErrors.NotFound
                    ? Promise.resolve([])
                    : Promise.reject(e)
                )
                .then((tags) =>
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
  );

export default all;
