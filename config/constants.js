const DAY_MAP = [
  "sunday",
  "monday",
  "tuesday",
  "wednessday",
  "thursday",
  "friday",
  "saturday",
];

const USER_TYPES = ["user", "admin"];
const DISCOUNT_TYPES = [
  "fixedAmount",
  "fixedPercent",
  "uptoAmount",
  "uptoPercent",
  "shipping",
];
const APPLY_TO_TYPES = ["wholeCart", "items"];
module.exports = { DAY_MAP, USER_TYPES, DISCOUNT_TYPES, APPLY_TO_TYPES };
