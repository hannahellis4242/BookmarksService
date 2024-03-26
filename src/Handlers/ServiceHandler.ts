import Handler from "./Handler";
import Service from "../Service/Service";
import Label from "../Model/Label";
import Link from "../Model/Link";
import ServiceErrors from "../Service/ServiceErrors";
import LinkID from "../Service/LinkID";
import LabelID from "../Service/LabelID";

const tagHelper = ([link, label]: [string, string]): [Link, Label] => [
  { link },
  { label },
];

export default class ServiceHandler implements Handler {
  constructor(private readonly service: Service) {}

  private getLinkIdOrSave(link: Link): Promise<LinkID> {
    return this.service
      .getLinkID(link)
      .catch((e) =>
        e === ServiceErrors.NotFound
          ? this.service.saveLink(link)
          : Promise.reject(e)
      );
  }
  private getLabelIdOrSave(label: Label): Promise<LabelID> {
    return this.service
      .getLabelID(label)
      .catch((e) =>
        e === ServiceErrors.NotFound
          ? this.service.saveLabel(label)
          : Promise.reject(e)
      );
  }

  createTag = (link: string, label: string): Promise<void> =>
    Promise.resolve(tagHelper([link, label]))
      .then(([linkObj, labelObj]) =>
        Promise.all([
          this.getLinkIdOrSave(linkObj),
          this.getLabelIdOrSave(labelObj),
        ])
      )
      .then(([linkId, labelId]) => this.service.saveTag(linkId, labelId))
      .then((_) => {});

  readLinkLabels = (link: string): Promise<string[]> =>
    Promise.resolve(link)
      .then((link) => this.service.getLinkID({ link }))
      .then(this.service.findTagsWithLink)
      .then((tagIDs) =>
        Promise.all(tagIDs.map((tagId) => this.service.getTagLabelID(tagId)))
      )
      .then((labelIds) =>
        Promise.all(labelIds.map((labelId) => this.service.getLabel(labelId)))
      )
      .then((labels) => labels.map(({ label }) => label));

  readLabelLinks = (label: string): Promise<string[]> =>
    Promise.resolve(label)
      .then((label) => this.service.getLabelID({ label }))
      .then((labelId) => this.service.findTagsWithLabel(labelId))
      .then((tagIDs) =>
        Promise.all(tagIDs.map((tagID) => this.service.getTagLinkID(tagID)))
      )
      .then((linkIds) =>
        Promise.all(linkIds.map((linkId) => this.service.getLink(linkId)))
      )
      .then((links) => links.map(({ link }) => link));
}
