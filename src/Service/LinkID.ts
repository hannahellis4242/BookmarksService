export default interface LinkID {
  t: "link";
  value: string;
}

export const linkID = (id: string): LinkID => ({ t: "link", value: id });
