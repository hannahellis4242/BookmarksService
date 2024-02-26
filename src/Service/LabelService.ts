import Label from "../Model/Label";
import LabelID from "./LabelID";

export default interface LabelService{
    allLabels():Promise<LabelID[]>;
    saveLabel(label:string):Promise<LabelID>;
    getLabelID(label:string):Promise<LabelID>;
    removeLabel(id:LabelID):Promise<void>;
    getLabel(id:LabelID):Promise<Label>
}