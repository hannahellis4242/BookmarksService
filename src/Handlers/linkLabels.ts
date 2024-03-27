import Label from "../Model/Label";
import Link from "../Model/Link";
import Tag from "../Model/Tag";

type TagsWithLinkFn = (link: Link) => Promise<Tag[]>;
type LinkLabelsFn = (link: Link) => Promise<Label[]>;
const linkLabels =
  (tagsWithLinkFn: TagsWithLinkFn): LinkLabelsFn =>
  (link: Link) =>
    Promise.resolve(link)
      .then(tagsWithLinkFn)
      .then((tags) => tags.map(({ label }) => label));
export default linkLabels;
