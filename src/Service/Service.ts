import LinkService from "./LinkService";
import LabelService from "./LabelService";
import TagService from "./TagService";

export default interface Service extends LinkService, LabelService, TagService{};
