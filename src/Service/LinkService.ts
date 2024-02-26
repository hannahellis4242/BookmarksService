import Link from "../Model/Link";
import LinkID from "./LinkID";

export default interface LinkService{
    allLinks():Promise<LinkID[]>;
    saveLink(link:Link):Promise<LinkID>;
    getLinkID(link:Link):Promise<LinkID>;
    removeLink(id:LinkID):Promise<void>;
    getLink(id:LinkID):Promise<Link>;
}