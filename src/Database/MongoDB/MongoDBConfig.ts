export interface Collections {
  link: string;
}
export default interface MongoDBConfig {
  url: string;
  database: string;
  collections: Collections;
}
