import { describe, it } from "mocha";
import { expect } from "chai";
import Validator from "./validator";

describe("validator", () => {
  it("should throw if a user doesn't have a name", () => {
    const validator = new Validator<any>({ name: (val) => !!val });
    expect(() => validator.validate({})).to.throw();
  });
  it("should throw if a user does also have an extra field", () => {
    const validator = new Validator<any>({ name: (val) => !!val });
    expect(() =>
      validator.validate({ name: "mahmut", extra: "extra" })
    ).to.throw();
  });
});
