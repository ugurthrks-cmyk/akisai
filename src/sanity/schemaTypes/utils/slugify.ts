const turkishCharMap: Record<string, string> = {
  Ç: "c",
  ç: "c",
  Ğ: "g",
  ğ: "g",
  İ: "i",
  I: "i",
  ı: "i",
  Ö: "o",
  ö: "o",
  Ş: "s",
  ş: "s",
  Ü: "u",
  ü: "u",
};

function replaceTurkishChars(value: string) {
  return value
    .split("")
    .map((char) => turkishCharMap[char] ?? char)
    .join("");
}

export function slugifyTurkish(input: string, maxLength = 120) {
  const normalized = replaceTurkishChars(input)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "");

  const slug = normalized
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug.slice(0, maxLength);
}
