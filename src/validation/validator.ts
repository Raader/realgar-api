import ValidationError, { FieldError } from "./validation_error";
import ValidationSchema from "./validation_schema";

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
    fieldsToValidate = this.allFields,
    fieldsToCheck = this.allFields
  ): void {
    if (!ignoreExtra) {
      const extraField = this.hasExtraFields(obj, fieldsToCheck);
      if (extraField)
        throw new ValidationError(
          [
            {
              message: `field ${extraField} does not exist in schema`,
              field: typeof extraField === "string" ? extraField : "",
            },
          ],
          `field ${extraField} does not exist in schema`
        );
    }
    const errors: FieldError[] = [];
    for (const field of fieldsToValidate) {
      const validationFn = this.schema[field];
      if (!validationFn)
        errors.push({
          message: `field ${field} does not exist in schema`,
          field: typeof field === "string" ? field : "",
        });
      else if (!validationFn(obj[field]))
        errors.push({
          message: `invalid field: ${field}`,
          field: typeof field === "string" ? field : "",
        });
    }
    if (errors.length > 0) {
      throw new ValidationError(errors, errors[0].message);
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
