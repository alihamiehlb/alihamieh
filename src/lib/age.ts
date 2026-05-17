const BIRTH_DATE = "2009-05-14";

export function getBirthDate(): string {
  return BIRTH_DATE;
}

export function getAge(asOf: Date = new Date()): number {
  const [y, m, d] = BIRTH_DATE.split("-").map(Number);
  let age = asOf.getFullYear() - y;
  const month = asOf.getMonth() + 1;
  const day = asOf.getDate();
  if (month < m || (month === m && day < d)) age -= 1;
  return age;
}

export function getBirthdayLabel(): string {
  const [y, m, d] = BIRTH_DATE.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function getAgePhrase(): string {
  return `${getAge()} years old`;
}
