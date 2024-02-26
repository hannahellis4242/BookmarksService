export default interface LinkID {
    t: "link";
    value: string;
  }
  
  export const linkId = (id: string): LinkID => ({ t: "link", value: id });
  