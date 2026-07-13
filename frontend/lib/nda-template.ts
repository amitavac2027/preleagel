export interface PartyInfo {
  companyName: string;
  printName: string;
  title: string;
  noticeAddress: string;
}

export type MndaTermType = "expires" | "continues";
export type ConfidentialityTermType = "fixed" | "perpetuity";

export interface NdaFormData {
  partyA: PartyInfo;
  partyB: PartyInfo;
  purpose: string;
  effectiveDate: string; // yyyy-mm-dd, as produced by <input type="date">
  mndaTermType: MndaTermType;
  mndaTermDuration: string;
  confidentialityTermType: ConfidentialityTermType;
  confidentialityTermDuration: string;
  governingLaw: string;
  jurisdiction: string;
  modifications: string;
}

const emptyParty: PartyInfo = {
  companyName: "",
  printName: "",
  title: "",
  noticeAddress: "",
};

export function createDefaultFormData(): NdaFormData {
  return {
    partyA: { ...emptyParty },
    partyB: { ...emptyParty },
    purpose:
      "Evaluating whether to enter into a business relationship with the other party.",
    effectiveDate: new Date().toISOString().slice(0, 10),
    mndaTermType: "expires",
    mndaTermDuration: "1 year(s)",
    confidentialityTermType: "fixed",
    confidentialityTermDuration: "1 year(s)",
    governingLaw: "",
    jurisdiction: "",
    modifications: "",
  };
}

export function formatEffectiveDate(isoDate: string): string {
  if (!isoDate) return "";
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function isNdaFormComplete(data: NdaFormData): boolean {
  const partyComplete = (party: PartyInfo) =>
    Boolean(
      party.companyName.trim() &&
        party.printName.trim() &&
        party.title.trim() &&
        party.noticeAddress.trim(),
    );

  return (
    partyComplete(data.partyA) &&
    partyComplete(data.partyB) &&
    Boolean(data.purpose.trim()) &&
    Boolean(data.effectiveDate.trim()) &&
    Boolean(data.mndaTermDuration.trim()) &&
    Boolean(data.confidentialityTermDuration.trim()) &&
    Boolean(data.governingLaw.trim()) &&
    Boolean(data.jurisdiction.trim())
  );
}

function fillCheckboxPair(
  template: string,
  pattern: RegExp,
  checkedFirst: boolean,
  firstDuration: string,
): string {
  return template.replace(pattern, (match, firstLine: string, secondLine: string) => {
    const withDuration = firstLine.replace(/\[[^\]]*\]/, `[${firstDuration}]`);
    const firstBox = checkedFirst ? "[x]" : "[ ]";
    const secondBox = checkedFirst ? "[ ]" : "[x]";
    return (
      withDuration.replace(/^- \[.\]/, `- ${firstBox}`) +
      "\n" +
      secondLine.replace(/^- \[.\]/, `- ${secondBox}`)
    );
  });
}

function fillTableRow(
  template: string,
  rowLabelPattern: RegExp,
  partyA: string,
  partyB: string,
): string {
  return template.replace(rowLabelPattern, (match, label: string) => {
    return `| ${label} | ${partyA} | ${partyB} |`;
  });
}

/**
 * Fills the Common Paper Mutual NDA cover page template with user-supplied
 * values. Placeholders are matched by their surrounding structural markers
 * (section headings, checkbox rows, table rows) rather than their literal
 * bracketed text, so the fill survives minor wording edits to the template.
 */
export function fillCoverPage(template: string, data: NdaFormData): string {
  let filled = template;

  filled = filled.replace(
    /(### Purpose\n<label>[^\n]*<\/label>\n\n)\[[^\]]*\]/,
    (match, prefix: string) => `${prefix}${data.purpose.trim()}`,
  );

  filled = filled.replace(
    /(### Effective Date\n)\[[^\]]*\]/,
    (match, prefix: string) => `${prefix}${formatEffectiveDate(data.effectiveDate)}`,
  );

  filled = fillCheckboxPair(
    filled,
    /(- \[.\]\s+Expires \[[^\]]*\] from Effective Date\.)\n(- \[.\]\s+Continues until terminated in accordance with the terms of the MNDA\.)/,
    data.mndaTermType === "expires",
    data.mndaTermDuration.trim(),
  );

  filled = fillCheckboxPair(
    filled,
    /(- \[.\]\s+\[[^\]]*\] from Effective Date, but in the case of trade secrets until Confidential Information is no longer considered a trade secret under applicable laws\.)\n(- \[.\]\s+In perpetuity\.)/,
    data.confidentialityTermType === "fixed",
    data.confidentialityTermDuration.trim(),
  );

  filled = filled.replace(
    /Governing Law: \[[^\]]*\]/,
    `Governing Law: ${data.governingLaw.trim()}`,
  );

  filled = filled.replace(
    /Jurisdiction: \[[^\]]*\]/,
    `Jurisdiction: ${data.jurisdiction.trim()}`,
  );

  filled = filled.replace(
    /(List any modifications to the MNDA\n\n)(By signing)/,
    (match, prefix: string, suffix: string) =>
      `${prefix}${data.modifications.trim() || "None."}\n\n${suffix}`,
  );

  filled = fillTableRow(filled, /\| (Print Name) \|[^\n]*/, data.partyA.printName, data.partyB.printName);
  filled = fillTableRow(filled, /\| (Title) \|[^\n]*/, data.partyA.title, data.partyB.title);
  filled = fillTableRow(filled, /\| (Company) \|[^\n]*/, data.partyA.companyName, data.partyB.companyName);
  filled = filled.replace(
    /\| (Notice Address) <label>[^\n]*<\/label> \|[^\n]*/,
    () => `| Notice Address | ${data.partyA.noticeAddress} | ${data.partyB.noticeAddress} |`,
  );

  return filled;
}

export function assembleDocument(filledCoverPage: string, standardTerms: string): string {
  return `${filledCoverPage.trim()}\n\n---\n\n${standardTerms.trim()}\n`;
}

export function buildDownloadFilename(data: NdaFormData): string {
  const slugify = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const partyASlug = slugify(data.partyA.companyName);
  const partyBSlug = slugify(data.partyB.companyName);

  if (partyASlug && partyBSlug) {
    return `mutual-nda-${partyASlug}-${partyBSlug}.md`;
  }
  return "mutual-nda.md";
}
