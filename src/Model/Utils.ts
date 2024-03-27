import Bookmark from "./Bookmark";
import Label from "./Label";
import Link from "./Link";
import Tag from "./Tag";

type TagsWithLabelFn = (label: Label) => Promise<Tag[]>;
type TagsWithLinkFn = (link: Link) => Promise<Tag[]>;

type LabelToLinksFn = (label: Label) => Promise<Link[]>;
type LinkToLabelsFn = (link: Link) => Promise<Label[]>;
type LinkToBookmarkFn = (link: Link) => Promise<Bookmark>;

export const labelToLinks =
  (tagsWithLinkFn: TagsWithLabelFn): LabelToLinksFn =>
  (label: Label) =>
    Promise.resolve(label)
      .then(tagsWithLinkFn)
      .then((tags) => tags.map(({ link }) => link));

export const linkToLabels =
  (tagsWithLinkFn: TagsWithLinkFn): LinkToLabelsFn =>
  (link: Link) =>
    Promise.resolve(link)
      .then(tagsWithLinkFn)
      .then((tags) => tags.map(({ label }) => label));

export const makeBookmark = (link: Link, labels: Label[]): Bookmark => ({
  link,
  labels,
});

export const linkToBookmark =
  (tagsWithLinkFn: TagsWithLinkFn): LinkToBookmarkFn =>
  (link: Link): Promise<Bookmark> =>
    Promise.resolve(link)
      .then(linkToLabels(tagsWithLinkFn))
      .then((labels: Label[]) => makeBookmark(link, labels));
