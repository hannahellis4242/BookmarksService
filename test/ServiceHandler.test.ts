import randomString from "random-string";
import MockService from "./MockService";
import { randomUUID } from "crypto";
import ServiceHandler from "../src/Handlers/ServiceHandler";
import LinkID, { linkID } from "../src/Service/LinkID";
import LabelID, { labelID } from "../src/Service/LabelID";
import TagID, { tagID } from "../src/Service/TagID";
import Label from "../src/Model/Label";
import Link from "../src/Model/Link";
import ServiceErrors from "../src/Service/ServiceErrors";

describe("ServiceHandler", () => {
  const mockService = new MockService();
  beforeEach(() => {
    Object.values(mockService).forEach((fn: jest.Mock) => fn.mockClear());
  });
  test("allLabelsForLink", async () => {
    const link = randomString();
    const linkId = linkID(randomUUID());
    const tagIds: readonly TagID[] = [tagID(randomUUID()), tagID(randomUUID())];
    const labelIds: readonly LabelID[] = [
      labelID(randomUUID()),
      labelID(randomUUID()),
    ];
    const labelValues: readonly string[] = [randomString(), randomString()];
    const labels: readonly Label[] = labelValues.map((label) => ({ label }));
    mockService.getLinkID.mockResolvedValueOnce(linkId);
    mockService.findTagsWithLink.mockResolvedValueOnce(tagIds);
    mockService.getTagLabelID.mockResolvedValueOnce(labelIds[0]);
    mockService.getTagLabelID.mockResolvedValueOnce(labelIds[1]);
    mockService.getLabel.mockResolvedValueOnce(labels[0]);
    mockService.getLabel.mockResolvedValueOnce(labels[1]);

    const handler = new ServiceHandler(mockService);
    const result = await handler.readLinkLabels(link);
    expect(result).toStrictEqual(labelValues);

    expect(mockService.getLinkID).toHaveBeenCalledTimes(1);
    expect(mockService.getLinkID).toHaveBeenCalledWith({ link });
    expect(mockService.findTagsWithLink).toHaveBeenCalledTimes(1);
    expect(mockService.findTagsWithLink).toHaveBeenCalledWith(linkId);
    expect(mockService.getTagLabelID).toHaveBeenCalledTimes(2);
    expect(mockService.getTagLabelID).toHaveBeenCalledWith(tagIds[0]);
    expect(mockService.getTagLabelID).toHaveBeenCalledWith(tagIds[1]);
    expect(mockService.getLabel).toHaveBeenCalledTimes(2);
    expect(mockService.getLabel).toHaveBeenCalledWith(labelIds[0]);
    expect(mockService.getLabel).toHaveBeenCalledWith(labelIds[1]);
  }, 1000);
  test("allLinksForLabel", async () => {
    const label = randomString();
    const labelId = linkID(randomUUID());
    const tagIds: readonly TagID[] = [tagID(randomUUID()), tagID(randomUUID())];
    const linkIds: readonly LinkID[] = [
      linkID(randomUUID()),
      linkID(randomUUID()),
    ];
    const linkValues: readonly string[] = [randomString(), randomString()];
    const links: readonly Link[] = linkValues.map((link) => ({ link }));
    mockService.getLabelID.mockResolvedValueOnce(labelId);
    mockService.findTagsWithLabel.mockResolvedValueOnce(tagIds);
    mockService.getTagLinkID.mockResolvedValueOnce(linkIds[0]);
    mockService.getTagLinkID.mockResolvedValueOnce(linkIds[1]);
    mockService.getLink.mockResolvedValueOnce(links[0]);
    mockService.getLink.mockResolvedValueOnce(links[1]);

    const handler = new ServiceHandler(mockService);
    const result = await handler.readLabelLinks(label);
    expect(result).toStrictEqual(linkValues);

    expect(mockService.getLabelID).toHaveBeenCalledTimes(1);
    expect(mockService.getLabelID).toHaveBeenCalledWith({ label });
    expect(mockService.findTagsWithLabel).toHaveBeenCalledTimes(1);
    expect(mockService.findTagsWithLabel).toHaveBeenCalledWith(labelId);
    expect(mockService.getTagLinkID).toHaveBeenCalledTimes(2);
    expect(mockService.getTagLinkID).toHaveBeenCalledWith(tagIds[0]);
    expect(mockService.getTagLinkID).toHaveBeenCalledWith(tagIds[1]);
    expect(mockService.getLink).toHaveBeenCalledTimes(2);
    expect(mockService.getLink).toHaveBeenCalledWith(linkIds[0]);
    expect(mockService.getLink).toHaveBeenCalledWith(linkIds[1]);
  }, 1000);
  test("create a tag from unknown link and label", async () => {
    const link = randomString();
    const label = randomString();
    const linkId = linkID(randomUUID());
    const labelId = labelID(randomUUID());
    const tagId = tagID(randomUUID());
    mockService.getLinkID.mockRejectedValueOnce(ServiceErrors.NotFound);
    mockService.getLabelID.mockRejectedValueOnce(ServiceErrors.NotFound);
    mockService.saveLink.mockResolvedValueOnce(linkId);
    mockService.saveLabel.mockResolvedValueOnce(labelId);
    mockService.saveTag.mockResolvedValueOnce(tagId);

    const handler = new ServiceHandler(mockService);
    const result = await handler.createTag(link, label);

    expect(mockService.getLinkID).toHaveBeenCalledTimes(1);
    expect(mockService.getLinkID).toHaveBeenCalledWith({ link });
    expect(mockService.getLabelID).toHaveBeenCalledTimes(1);
    expect(mockService.getLabelID).toHaveBeenCalledWith({ label });
    expect(mockService.saveLink).toHaveBeenCalledTimes(1);
    expect(mockService.saveLink).toHaveBeenCalledWith({ link });
    expect(mockService.saveLabel).toHaveBeenCalledTimes(1);
    expect(mockService.saveLabel).toHaveBeenCalledWith({ label });
    expect(mockService.saveTag).toHaveBeenCalledTimes(1);
    expect(mockService.saveTag).toHaveBeenCalledWith(linkId, labelId);
  });
});
