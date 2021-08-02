type ValidationSchema<Type> = {
  [Property in keyof Type]: ValidationFunction;
};

type ValidationFunction = (val: any) => boolean;

export default class Validator<Type> {
  private schema: ValidationSchema<Type>;
  private allFields: Array<keyof Type>;

  constructor(schema: ValidationSchema<Type>) {
    this.schema = schema;
    this.allFields = Object.keys(this.schema) as Array<keyof Type>;
  }

  validate(
    obj: Partial<Type>,
    ignoreExtra = false,
    fieldsToValidate = this.allFields
  ): void {
    if (!ignoreExtra) {
      const extraField = this.hasExtraFields(obj);
      if (extraField)
        throw new Error(`field ${extraField} does not exist in schema`);
    }
    for (const field of fieldsToValidate) {
      const validationFn = this.schema[field];
      if (!validationFn)
        throw new Error(`field ${field} does not exist in schema`);
      else if (!validationFn(obj[field]))
        throw new Error(`invalid field: ${field}`);
    }
  }

  private hasExtraFields(
    obj: Partial<Type>,
    fieldsToCheck = this.allFields
  ): boolean | string {
    const fields: Array<keyof Type> = Object.keys(obj) as Array<keyof Type>;
    for (const field of fields) {
      if (!fieldsToCheck.includes(field)) return field as string;
    }
    return false;
  }
}
