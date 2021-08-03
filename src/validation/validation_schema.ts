type ValidationSchema<Type> = {
  [Property in keyof Type]: ValidationFunction;
};

type ValidationFunction = (val: any) => boolean;

export default ValidationSchema;
