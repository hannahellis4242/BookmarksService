import Handler from "../src/Handlers/Handler";

export default class MockHandler implements Handler {
  readLinkLabels = jest.fn();
  readLabelLinks = jest.fn();
  createTag = jest.fn();
}
