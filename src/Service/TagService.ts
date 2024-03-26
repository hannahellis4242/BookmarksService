import LabelID from "./LabelID";
import LinkID from "./LinkID";
import TagID from "./TagID";

export default interface TagService{
    saveTag(linkId:LinkID,labelId:LabelID):Promise<TagID>;
    allTags():Promise<TagID[]>;
    findTagsWithLabel(labelId:LabelID):Promise<TagID[]>;
    findTagsWithLink(linkId:LinkID):Promise<TagID[]>;
    getTagLinkID(tagId:TagID):Promise<LinkID>;
    getTagLabelID(tagID:TagID):Promise<LabelID>;
}