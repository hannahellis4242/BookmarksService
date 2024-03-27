export default interface Handler {
  readLinkLabels(link: string): Promise<string[]>;
  readLabelLinks(label: string): Promise<string[]>;
  createTag(link: string, label: string): Promise<void>;
}
