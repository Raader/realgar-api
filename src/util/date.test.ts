import { describe, it } from "mocha";

import { expect } from "chai";
import { extractDate } from "./date";
import { useFakeTimers } from "sinon";

describe("date utils", () => {
  it("should extract date from given date object correctly", () => {
    const { day, month, year } = extractDate(new Date("2021-08-15"));
    expect(day).to.equal(15);
    expect(month).to.equal(7);
    expect(year).to.equal(2021);
  });

  it("should extract date from given string correctly", () => {
    const { day, month, year } = extractDate("2021-08-15");
    expect(day).to.equal(15);
    expect(month).to.equal(7);
    expect(year).to.equal(2021);
  });

  it("should extract date from given number correctly", () => {
    const { day, month, year } = extractDate(1628985600000);
    expect(day).to.equal(15);
    expect(month).to.equal(7);
    expect(year).to.equal(2021);
  });

  it("should extract date from date.now if no arguments", () => {
    const clock = useFakeTimers(1628985600000);
    const { day, month, year } = extractDate();
    expect(day).to.equal(15);
    expect(month).to.equal(7);
    expect(year).to.equal(2021);
    clock.restore();
  });
});
