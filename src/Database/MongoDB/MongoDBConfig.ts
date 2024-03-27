export interface Collections {
  link: string;
  label: string;
}
export default interface MongoDBConfig {
  url: string;
  database: string;
  collections: Collections;
}
