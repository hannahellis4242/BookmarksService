export default interface TagID {
    t: "tag";
    value: string;
  }
  
  export const tagID = (id: string): TagID => ({ t: "tag", value: id });
  