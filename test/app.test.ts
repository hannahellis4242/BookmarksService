import request from "supertest";
import createApp from "../src/app";
import { StatusCodes } from "http-status-codes";
import LinkID, { linkID } from "../src/Service/LinkID";
import { randomUUID } from "crypto";
import randomString from "random-string";
import ServiceErrors from "../src/Service/ServiceErrors";
import LabelID, { labelID } from "../src/Service/LabelID";
import MockService from "./MockService";
import Label from "../src/Model/Label";
import TagID, { tagID } from "../src/Service/TagID";
import Link from "../src/Model/Link";

describe("app", () => {
  const mockService = new MockService();
  const app = createApp(mockService);
  beforeEach(() => {
    Object.values(mockService).forEach((fn: jest.Mock) => fn.mockClear());
  });
  describe("link endpoint", () => {
    test("post a link", async () => {
      const link = randomString();
      const id = randomUUID();
      mockService.saveLink.mockResolvedValueOnce(linkID(id));
      const response = await request(app).post("/link").send({ link });
      expect(response.statusCode).toBe(StatusCodes.CREATED);
      expect(response.body).toBe(id);
      expect(mockService.saveLink).toHaveBeenCalledWith({ link });
      expect(mockService.saveLink).toHaveBeenCalledTimes(1);
    }, 1000);
    test("post a link twice", async () => {
      const link = randomString();
      const id = randomUUID();
      mockService.saveLink.mockResolvedValueOnce(linkID(id));
      mockService.saveLink.mockRejectedValueOnce(ServiceErrors.AlreadyExists);
      const response = await request(app).post("/link").send({ link });
      expect(response.statusCode).toBe(StatusCodes.CREATED);
      expect(response.body).toBe(id);

      const response2 = await request(app).post("/link").send({ link });
      expect(response2.statusCode).toBe(StatusCodes.CONFLICT);
      expect(response2.body).toStrictEqual({});

      expect(mockService.saveLink).toHaveBeenCalledWith({ link });
      expect(mockService.saveLink).toHaveBeenCalledTimes(2);
    }, 1000);
    test("get a link's id", async () => {
      const link = randomString();
      const id = randomUUID();
      mockService.getLinkID.mockResolvedValueOnce(linkID(id));
      const response = await request(app).get("/link").query({ link });
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body).toBe(id);
    }, 1000);
    test("get a non existant link's id", async () => {
      const link = randomString();

      mockService.getLinkID.mockRejectedValueOnce(ServiceErrors.NotFound);

      const response = await request(app).get("/link").query({ link });
      expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
      expect(response.body).toStrictEqual({});
      expect(mockService.getLinkID).toHaveBeenCalledTimes(1);
    }, 1000);
    test("delete a non existant link", async () => {
      const link = randomString();
      mockService.getLinkID.mockRejectedValueOnce(ServiceErrors.NotFound);
      const response = await request(app).delete("/link").query({ link });
      expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
      expect(response.body).toStrictEqual({});
      expect(mockService.getLinkID).toHaveBeenCalledTimes(1);
    }, 1000);
    test("delete a link", async () => {
      const link = randomString();
      const id = randomUUID();
      mockService.getLinkID.mockResolvedValueOnce(linkID(id));
      mockService.removeLink.mockResolvedValueOnce(undefined);
      const response = await request(app).delete("/link").query({ link });
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body).toStrictEqual({});
      expect(mockService.getLinkID).toHaveBeenCalledTimes(1);
    }, 1000);
  });
  describe("label endpoints", () => {
    test("get labels", async () => {
      const label = randomString();
      const id = randomUUID();
      mockService.allLabels.mockResolvedValueOnce([labelID(id)]);
      mockService.getLabel.mockResolvedValueOnce({ label });
      const response = await request(app).get("/label/all");
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body).toStrictEqual([label]);
      expect(mockService.allLabels).toHaveBeenCalledTimes(1);
      expect(mockService.getLabel).toHaveBeenCalledTimes(1);
      expect(mockService.getLabel).toHaveBeenCalledWith(labelID(id));
    }, 1000);
    test("get labels but there are no labels", async () => {
      mockService.allLabels.mockRejectedValueOnce(ServiceErrors.NotFound);
      const response = await request(app).get("/label/all");
      expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
      expect(response.body).toStrictEqual({});
      expect(mockService.allLabels).toHaveBeenCalledTimes(1);
      expect(mockService.getLabel).not.toHaveBeenCalled();
    }, 1000);
  });
  describe("tag endpoints", () => {
    test("get all tagged labels for a link", async () => {
      const link = randomString();
      const linkId = linkID(randomUUID());
      const tagIds: readonly TagID[] = [
        tagID(randomUUID()),
        tagID(randomUUID()),
      ];
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

      const response = await request(app).get("/tag").query({ link });
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body).toStrictEqual(labelValues);

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
    test("get all links for a label", async () => {
      const label = randomString();
      const labelId = linkID(randomUUID());
      const tagIds: readonly TagID[] = [
        tagID(randomUUID()),
        tagID(randomUUID()),
      ];
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

      const response = await request(app).get(`/tag/${label}`);
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body).toStrictEqual(linkValues);

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
    test("post a tag for a link and label that doesn't currently exist", async () => {
      const link = randomString();
      const label = randomString();
      const linkId = linkID(randomUUID());
      const labelId = labelID(randomUUID());
      const tagId = tagID(randomUUID());
      mockService.saveLink.mockResolvedValueOnce(linkId);
      mockService.saveLabel.mockResolvedValueOnce(labelId);
      mockService.saveTag.mockResolvedValueOnce(tagId);

      const response = await request(app).post("/tag").send({ link , label });
      expect(response.statusCode).toBe(StatusCodes.CREATED);

      expect(mockService.saveLink).toHaveBeenCalledTimes(1);
      expect(mockService.saveLink).toHaveBeenCalledWith({link});
      expect(mockService.saveLabel).toHaveBeenCalledTimes(1);
      expect(mockService.saveLabel).toHaveBeenCalledWith({label});
      expect(mockService.saveTag).toHaveBeenCalledTimes(1);
      expect(mockService.saveTag).toHaveBeenCalledWith(linkId,labelId);
    }, 1000);
  });
});
