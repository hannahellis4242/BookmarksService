import request from "supertest";
import Service from "../src/Service/Service";
import createApp from "../src/app";
import { StatusCodes } from "http-status-codes";
import { linkId } from "../src/Service/LinkID";
import { randomUUID } from "crypto";
import randomString from "random-string";
import ServiceErrors from "../src/Service/ServiceErrors";
import { labelID } from "../src/Service/LabelID";

class MockService implements Service {
  allLinks = jest.fn();
  saveLink = jest.fn();
  getLinkID = jest.fn();
  removeLink = jest.fn();
  getLink = jest.fn();
  allLabels = jest.fn();
  saveLabel = jest.fn();
  getLabelID = jest.fn();
  removeLabel = jest.fn();
  getLabel = jest.fn();
  addTag = jest.fn();
  allTags = jest.fn();
  findTagsWithLabel = jest.fn();
  findTagsWithLink = jest.fn();
  getTagLinkID = jest.fn();
  getTagLabelID = jest.fn();
}

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
      mockService.saveLink.mockResolvedValueOnce(linkId(id));
      const response = await request(app).post("/link").send({ link });
      expect(response.statusCode).toBe(StatusCodes.CREATED);
      expect(response.body).toBe(id);
      expect(mockService.saveLink).toHaveBeenCalledWith({ link });
      expect(mockService.saveLink).toHaveBeenCalledTimes(1);
    }, 1000);
    test("post a link twice", async () => {
      const link = randomString();
      const id = randomUUID();
      mockService.saveLink.mockResolvedValueOnce(linkId(id));
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
      mockService.getLinkID.mockResolvedValueOnce(linkId(id));
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
      mockService.getLinkID.mockResolvedValueOnce(linkId(id));
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
      mockService.getLabel.mockResolvedValueOnce({label});
      const response = await request(app).get("/label/all");
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body).toStrictEqual([label]);
      expect(mockService.allLabels).toHaveBeenCalledTimes(1);
      expect(mockService.getLabel).toHaveBeenCalledTimes(1);
      expect(mockService.getLabel).toHaveBeenCalledWith(labelID(id));
    }, 1000);
    test("get labels but there are no labels", async () => {
        const label = randomString();
        const id = randomUUID();
        mockService.allLabels.mockRejectedValueOnce(ServiceErrors.NotFound);
        const response = await request(app).get("/label/all");
        expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
        expect(response.body).toStrictEqual({});
        expect(mockService.allLabels).toHaveBeenCalledTimes(1);
        expect(mockService.getLabel).not.toHaveBeenCalled()
      }, 1000);
  });
});
