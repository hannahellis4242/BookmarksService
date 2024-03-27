import Bookmark from "./Bookmark";
import Label from "./Label";
import Link from "./Link";
import Tag from "./Tag";

//in
export const makeLabel = (str: string): Label => ({ label: str });
export const makeLink = (str: string): Link => ({ link: str });
export type LinkLabelPair = [Link, Label];
export const makeLinkLabelPair = ([a, b]: [string, string]): LinkLabelPair => [
  makeLink(a),
  makeLabel(b),
];
export const toTag = ([link, label]: LinkLabelPair) => ({ link, label });
export const makeTag = (x: [string, string]): Tag =>
  toTag(makeLinkLabelPair(x));

//out

export const getLinkValue = ({ link }: Link): string => link;
export const getLabelValue = ({ label }: Label): string => label;
export const getTagValue = ({ link, label }: Tag): [string, string] => [
  getLinkValue(link),
  getLabelValue(label),
];
export const getBookmarkValue = ({ link, labels }: Bookmark) => ({
  link: getLinkValue(link),
  labels: labels.map(getLabelValue),
});
