import Label from "../Model/Label";
import LabelID from "./LabelID";

export default interface LabelService{
    allLabels():Promise<LabelID[]>;
    saveLabel(label:Label):Promise<LabelID>;
    getLabelID(label:Label):Promise<LabelID>;
    removeLabel(id:LabelID):Promise<void>;
    getLabel(id:LabelID):Promise<Label>
}