interface Request {
  payload: any;
}

type ExcludeFromObject<
  ObjectType extends Record<string, any>,
  Key extends keyof ObjectType
> = {
  [k in Exclude<keyof ObjectType, Key>]: ObjectType[k];
};
