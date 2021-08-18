export interface FieldError {
  message: string;
  field: string;
}

export default class ValidationError extends Error {
  errors: FieldError[];

  constructor(errors: FieldError[], message: string) {
    super(message);
    Object.setPrototypeOf(this, ValidationError.prototype);
    this.name = "ValidationError";
    this.errors = errors;
  }
}
