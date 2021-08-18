import { describe, it } from "mocha";
import { expect } from "chai";
import Validator from "./validator";
import ValidationError from "./validation_error";

describe("validator", () => {
  let validator: Validator<any>;

  beforeEach(() => {
    validator = new Validator<any>({
      name: (val) => val && typeof val === "string",
      age: (val) => val && typeof val === "number",
      job: (val) => {
        if (val) return typeof val === "string";
        return true;
      },
    });
  });

  it("should throw if a user doesn't have a name", () => {
    expect(() => validator.validate({})).to.throw();
  });

  it("should throw if a user does also have an extra field", () => {
    expect(() =>
      validator.validate({ name: "mahmut", extra: "extra" })
    ).to.throw();
  });

  it("should throw an Validation Error", () => {
    expect(() => validator.validate({})).to.throw(ValidationError);
  });

  it("should have an error for field on errors on validation error", () => {
    try {
      validator.validate({ name: "mahmut", job: "tornacı" });
    } catch (error) {
      expect(error?.errors).to.have.lengthOf(1);
    }
  });

  it("should have error for all invalid fields on validation error", () => {
    try {
      validator.validate({ name: "mahmut", job: 5 });
    } catch (error) {
      expect(error?.errors).to.have.lengthOf(2);
      expect(error?.errors[0]).property("field").to.equal("age");
      expect(error?.errors[1]).property("field").to.equal("job");
    }
  });

  it("should throw when updating name", () => {
    expect(() =>
      validator.validate(
        { name: "mahmut", job: "torna" },
        false,
        ["job"],
        ["job"]
      )
    ).to.throw(ValidationError);
  });
});
