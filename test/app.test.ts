import request from "supertest";
import createApp from "../src/app";
import { StatusCodes } from "http-status-codes";
import { randomUUID } from "crypto";
import randomString from "random-string";
import MockService from "./MockService";
import MockHandler from "./MockHandler";
import ServiceErrors from "../src/Service/ServiceErrors";
import { linkID } from "../src/Service/LinkID";
import { labelID } from "../src/Service/LabelID";

describe("app", () => {
  const mockService = new MockService();
  const mockHandler = new MockHandler();
  const app = createApp(mockService, mockHandler);
  beforeEach(() => {
    Object.values(mockService).forEach((fn: jest.Mock) => fn.mockClear());
    Object.values(mockHandler).forEach((fn: jest.Mock) => fn.mockClear());
  });
  describe("link endpoint :", () => {
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
    test("get all links tagged with label", async () => {
      const label = randomString();
      const links: readonly string[] = [randomString(), randomString()];
      mockHandler.readLabelLinks.mockResolvedValueOnce(links);

      const response = await request(app)
        .get("/link/tagged")
        .query({ label })
        .timeout(1000);
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body).toStrictEqual(links);

      expect(mockHandler.readLabelLinks).toHaveBeenCalledTimes(1);
      expect(mockHandler.readLabelLinks).toHaveBeenCalledWith(label);
    }, 2000);
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
    test("get all labels tagged against a link", async () => {
      const link = randomString();
      const labels: readonly string[] = [randomString(), randomString()];
      mockHandler.readLinkLabels.mockResolvedValueOnce(labels);
      const response = await request(app)
        .get("/label/tagged")
        .query({ link })
        .timeout(1000);
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body).toStrictEqual(labels);

      expect(mockHandler.readLinkLabels).toHaveBeenCalledTimes(1);
      expect(mockHandler.readLinkLabels).toHaveBeenCalledWith(link);
    }, 2000);
  });
  describe("tag endpoints :", () => {
    test("post a tag for a link and label that doesn't currently exist", async () => {
      const link = randomString();
      const label = randomString();
      mockHandler.createTag.mockReturnValueOnce(undefined);

      const response = await request(app)
        .post("/tag")
        .send({ link, label })
        .timeout(1000);
      expect(response.statusCode).toBe(StatusCodes.CREATED);

      expect(mockHandler.createTag).toHaveBeenCalledTimes(1);
      expect(mockHandler.createTag).toHaveBeenCalledWith(link, label);
    }, 2000);
  });
});
