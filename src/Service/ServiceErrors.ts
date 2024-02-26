const ServiceErrors = {
  NotFound: "NotFound",
  NotImpl: "NotImpl",
  TooMany: "TooMany",
  DBError: "DBError",
  AlreadyExists:"AlreadyExists",
} as const;

type ServiceErrors = (typeof ServiceErrors)[keyof typeof ServiceErrors];
export default ServiceErrors;
