import LinkActions from "./LinkActions";
import LabelActions from "./LabelActions";
import TagActions from "./TagActions";

export default interface DatabaseActions {
  link: LinkActions;
  label: LabelActions;
  tag: TagActions;
}
