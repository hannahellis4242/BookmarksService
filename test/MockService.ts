import Service from "../src/Service/Service";

export default class MockService implements Service {
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
    saveTag = jest.fn();
    allTags = jest.fn();
    findTagsWithLabel = jest.fn();
    findTagsWithLink = jest.fn();
    getTagLinkID = jest.fn();
    getTagLabelID = jest.fn();
  }