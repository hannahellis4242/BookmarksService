export default interface LabelID {
    t: "label";
    value: string;
  }
  
  export const labelID = (id: string): LabelID => ({ t: "label", value: id });
  