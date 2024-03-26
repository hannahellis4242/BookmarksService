import { MongoClient, ObjectId, WithId } from "mongodb";
import ServiceErrors from "./ServiceErrors";
import LinkID, { linkID } from "./LinkID";
import LabelID, { labelID } from "./LabelID";
import TagID, { tagID } from "./TagID";
import Link from "../Model/Link";
import Label from "../Model/Label";
import Service from "./Service";

export interface CollectionNames {
  readonly link: string;
  readonly label: string;
  readonly tag: string;
}

interface Tag {
  label: ObjectId;
  link: ObjectId;
}

export default class MongoDBService implements Service {
  private url: string;
  constructor(
    host: string,
    private readonly dbName: string,
    private readonly collections: CollectionNames
  ) {
    this.url = `mongodb://${host}:27017`;
  }
  allLabels(): Promise<LabelID[]> {
    const client = new MongoClient(this.url);
    return client
      .connect()
      .then((client) => client.db(this.dbName))
      .then((db) => db.collection(this.collections.label))
      .then((collection) => collection.find<WithId<Label>>({}).toArray())
      .then((existing) =>
        existing.length !== 0
          ? Promise.resolve(existing)
          : Promise.reject(ServiceErrors.NotFound)
      )
      .then((links) => links.map(({ _id }) => labelID(_id.toString())))
      .finally(() => client.close());
  }
  allLinks(): Promise<LinkID[]> {
    const client = new MongoClient(this.url);
    return client
      .connect()
      .then((client) => client.db(this.dbName))
      .then((db) => db.collection(this.collections.link))
      .then((collection) => collection.find<WithId<Link>>({}).toArray())
      .then((existing) =>
        existing.length !== 0
          ? Promise.resolve(existing)
          : Promise.reject(ServiceErrors.NotFound)
      )
      .then((links) => links.map(({ _id }) => linkID(_id.toString())))
      .finally(() => client.close());
  }
  allTags(): Promise<TagID[]> {
    const client = new MongoClient(this.url);
    return client
      .connect()
      .then((client) => client.db(this.dbName))
      .then((db) => db.collection(this.collections.tag))
      .then((collection) => collection.find<WithId<Tag>>({}).toArray())
      .then((existing) =>
        existing.length !== 0
          ? Promise.resolve(existing)
          : Promise.reject(ServiceErrors.NotFound)
      )
      .then((tags) => tags.map(({ _id }) => tagID(_id.toString())))
      .finally(() => client.close());
  }
  getTagLabelID(tagID: TagID): Promise<LabelID> {
    const client = new MongoClient(this.url);
    return client
      .connect()
      .then((client) => client.db(this.dbName))
      .then((db) => db.collection(this.collections.tag))
      .then((collection) =>
        collection.findOne<Tag>({ _id: new ObjectId(tagID.value) })
      )
      .then((existing) =>
        existing
          ? Promise.resolve(existing.label)
          : Promise.reject(ServiceErrors.NotFound)
      )
      .then((label) => labelID(label.toString()))
      .finally(() => client.close());
  }
  findTagsWithLink(linkId: LinkID): Promise<TagID[]> {
    const client = new MongoClient(this.url);
    return client
      .connect()
      .then((client) => client.db(this.dbName))
      .then((db) => db.collection(this.collections.tag))
      .then((collection) =>
        collection.find({ link: new ObjectId(linkId.value) }).toArray()
      )
      .then((existing) =>
        existing.length === 0
          ? Promise.reject(ServiceErrors.NotFound)
          : Promise.resolve(existing.map(({ _id }) => tagID(_id.toString())))
      )
      .finally(() => client.close());
  }
  getLabel(id: LabelID): Promise<Label> {
    const client = new MongoClient(this.url);
    return client
      .connect()
      .then((client) => client.db(this.dbName))
      .then((db) => db.collection(this.collections.label))
      .then((collection) =>
        collection.findOne<Label>({ _id: new ObjectId(id.value) })
      )
      .then((existing) =>
        existing !== null
          ? Promise.resolve({ label: existing.label })
          : Promise.reject(ServiceErrors.NotFound)
      )
      .finally(() => client.close());
  }
  findTagsWithLabel(labelId: LabelID): Promise<TagID[]> {
    const client = new MongoClient(this.url);
    return client
      .connect()
      .then((client) => client.db(this.dbName))
      .then((db) => db.collection(this.collections.tag))
      .then((collection) =>
        collection.find({ label: new ObjectId(labelId.value) }).toArray()
      )
      .then((existing) =>
        existing.length === 0
          ? Promise.reject(ServiceErrors.NotFound)
          : Promise.resolve(existing.map(({ _id }) => tagID(_id.toString())))
      )
      .finally(() => client.close());
  }
  getTagLinkID(tagId: TagID): Promise<LinkID> {
    const client = new MongoClient(this.url);
    return client
      .connect()
      .then((client) => client.db(this.dbName))
      .then((db) => db.collection(this.collections.tag))
      .then((collection) =>
        collection.findOne<Tag>({ _id: new ObjectId(tagId.value) })
      )
      .then((existing) =>
        existing
          ? Promise.resolve(existing.link)
          : Promise.reject(ServiceErrors.NotFound)
      )
      .then((id) => linkID(id.toString()))
      .finally(() => client.close());
  }
  getLink(id: LinkID): Promise<Link> {
    const client = new MongoClient(this.url);
    return client
      .connect()
      .then((client) => client.db(this.dbName))
      .then((db) => db.collection(this.collections.link))
      .then((collection) =>
        collection.findOne<Link>({ _id: new ObjectId(id.value) })
      )
      .then((existing) =>
        existing !== null
          ? Promise.resolve({ link: existing.link })
          : Promise.reject(ServiceErrors.NotFound)
      )
      .finally(() => client.close());
  }
  saveLabel(label: Label): Promise<LabelID> {
    const client = new MongoClient(this.url);
    return client
      .connect()
      .then((client) => client.db(this.dbName))
      .then((db) => db.collection(this.collections.label))
      .then((collection) =>
        collection.findOne(label).then((existing) => ({ collection, existing }))
      )
      .then(({ collection, existing }) =>
        existing === null
          ? Promise.resolve(collection)
          : Promise.reject(ServiceErrors.AlreadyExists)
      )
      .then((collection) => collection.insertOne(label))
      .then((doc) => labelID(doc.insertedId.toString()))
      .catch((error) => {
        console.error(`Link Service Error : ${error}`);
        return error === ServiceErrors.AlreadyExists
          ? Promise.reject(ServiceErrors.AlreadyExists)
          : Promise.reject(ServiceErrors.DBError);
      })
      .finally(() => client.close());
  }
  getLabelID(label: Label): Promise<LabelID> {
    const client = new MongoClient(this.url);
    return client
      .connect()
      .then((client) => client.db(this.dbName))
      .then((db) => db.collection(this.collections.label))
      .then((collection) => collection.findOne(label))
      .then((found) =>
        found
          ? Promise.resolve(found._id)
          : Promise.reject(ServiceErrors.NotFound)
      )
      .then((id) => labelID(id.toString()))
      .finally(() => client.close());
  }
  removeLabel(id: LabelID): Promise<void> {
    //TODO
    throw new Error("Method not implemented.");
  }
  saveTag(linkID: LinkID, labelID: LabelID): Promise<TagID> {
    const link = new ObjectId(linkID.value);
    const label = new ObjectId(labelID.value);
    const client = new MongoClient(this.url);
    return client
      .connect()
      .then((client) => client.db(this.dbName))
      .then((db) => db.collection(this.collections.tag))
      .then((collection) =>
        collection
          .findOne({ link, label })
          .then((existing) => ({ collection, existing }))
      )
      .then(({ collection, existing }) =>
        existing === null
          ? Promise.resolve(collection)
          : Promise.reject(ServiceErrors.AlreadyExists)
      )
      .then((collection) => collection.insertOne({ link, label }))
      .then((doc) => tagID(doc.insertedId.toString()))
      .catch((error) => {
        console.error(`Link Service Error : ${error}`);
        return error === ServiceErrors.AlreadyExists
          ? Promise.reject(ServiceErrors.AlreadyExists)
          : Promise.reject(ServiceErrors.DBError);
      })
      .finally(() => client.close());
  }
  removeLink(id: LinkID): Promise<void> {
    const client = new MongoClient(this.url);
    return client
      .connect()
      .then((client) => client.db(this.dbName))
      .then((db) => db.collection(this.collections.link))
      .then((collection) =>
        collection.deleteOne({ _id: new ObjectId(id.value) })
      )
      .then((result) =>
        result.acknowledged
          ? Promise.resolve(result.deletedCount)
          : Promise.reject(ServiceErrors.DBError)
      )
      .then((count) =>
        count > 0 ? Promise.resolve() : Promise.reject(ServiceErrors.NotFound)
      )
      .catch((error) => {
        console.error(error);
        return Promise.reject(ServiceErrors.DBError);
      })
      .finally(() => client.close());
  }
  getLinkID(link: Link): Promise<LinkID> {
    const client = new MongoClient(this.url);
    return client
      .connect()
      .then((client) => client.db(this.dbName))
      .then((db) => db.collection(this.collections.link))
      .then((collection) => collection.findOne(link))
      .then((found) =>
        found
          ? Promise.resolve(found._id)
          : Promise.reject(ServiceErrors.NotFound)
      )
      .then((id) => linkID(id.toString()))
      .finally(() => client.close());
  }
  saveLink(link: Link): Promise<LinkID> {
    const client = new MongoClient(this.url);
    return client
      .connect()
      .then((client) => client.db(this.dbName))
      .then((db) => db.collection(this.collections.link))
      .then((collection) =>
        collection.findOne(link).then((existing) => ({ collection, existing }))
      )
      .then(({ collection, existing }) =>
        existing === null
          ? Promise.resolve(collection)
          : Promise.reject(ServiceErrors.AlreadyExists)
      )
      .then((collection) => collection.insertOne(link))
      .then((doc) => linkID(doc.insertedId.toString()))
      .catch((error) => {
        console.error(`Link Service Error : ${error}`);
        return error === ServiceErrors.AlreadyExists
          ? Promise.reject(ServiceErrors.AlreadyExists)
          : Promise.reject(ServiceErrors.DBError);
      })
      .finally(() => client.close());
  }
}
