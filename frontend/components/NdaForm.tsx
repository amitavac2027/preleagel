import type { Dispatch, ReactNode, SetStateAction } from "react";
import type { NdaFormData, PartyInfo } from "@/lib/nda-template";

type PartyKey = "partyA" | "partyB";
type SetFormData = Dispatch<SetStateAction<NdaFormData>>;

const inputClasses =
  "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-zinc-700 dark:text-zinc-300">
        {label}
      </span>
      {children}
    </label>
  );
}

function PartyFields({
  legend,
  party,
  value,
  onChange,
}: {
  legend: string;
  party: PartyKey;
  value: PartyInfo;
  onChange: SetFormData;
}) {
  const update = (field: keyof PartyInfo, fieldValue: string) => {
    onChange((prev) => ({
      ...prev,
      [party]: { ...prev[party], [field]: fieldValue },
    }));
  };

  return (
    <fieldset className="space-y-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
      <legend className="px-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        {legend}
      </legend>
      <Field label="Company name">
        <input
          className={inputClasses}
          value={value.companyName}
          onChange={(e) => update("companyName", e.target.value)}
          placeholder="Acme, Inc."
        />
      </Field>
      <Field label="Signatory name">
        <input
          className={inputClasses}
          value={value.printName}
          onChange={(e) => update("printName", e.target.value)}
          placeholder="Jane Doe"
        />
      </Field>
      <Field label="Signatory title">
        <input
          className={inputClasses}
          value={value.title}
          onChange={(e) => update("title", e.target.value)}
          placeholder="General Counsel"
        />
      </Field>
      <Field label="Notice address (email or postal)">
        <input
          className={inputClasses}
          value={value.noticeAddress}
          onChange={(e) => update("noticeAddress", e.target.value)}
          placeholder="legal@acme.com"
        />
      </Field>
    </fieldset>
  );
}

export default function NdaForm({
  data,
  onChange,
}: {
  data: NdaFormData;
  onChange: SetFormData;
}) {
  return (
    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <PartyFields
          legend="Party 1"
          party="partyA"
          value={data.partyA}
          onChange={onChange}
        />
        <PartyFields
          legend="Party 2"
          party="partyB"
          value={data.partyB}
          onChange={onChange}
        />
      </div>

      <Field label="Purpose">
        <textarea
          className={inputClasses}
          rows={2}
          value={data.purpose}
          onChange={(e) =>
            onChange((prev) => ({ ...prev, purpose: e.target.value }))
          }
        />
      </Field>

      <Field label="Effective date">
        <input
          type="date"
          className={inputClasses}
          value={data.effectiveDate}
          onChange={(e) =>
            onChange((prev) => ({ ...prev, effectiveDate: e.target.value }))
          }
        />
      </Field>

      <fieldset className="space-y-2 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
        <legend className="px-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          MNDA term
        </legend>
        <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
          <input
            type="radio"
            name="mndaTermType"
            checked={data.mndaTermType === "expires"}
            onChange={() =>
              onChange((prev) => ({ ...prev, mndaTermType: "expires" }))
            }
          />
          Expires
          <input
            className={`${inputClasses} w-32`}
            value={data.mndaTermDuration}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                mndaTermDuration: e.target.value,
              }))
            }
            disabled={data.mndaTermType !== "expires"}
          />
          from effective date
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
          <input
            type="radio"
            name="mndaTermType"
            checked={data.mndaTermType === "continues"}
            onChange={() =>
              onChange((prev) => ({ ...prev, mndaTermType: "continues" }))
            }
          />
          Continues until terminated
        </label>
      </fieldset>

      <fieldset className="space-y-2 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
        <legend className="px-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Term of confidentiality
        </legend>
        <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
          <input
            type="radio"
            name="confidentialityTermType"
            checked={data.confidentialityTermType === "fixed"}
            onChange={() =>
              onChange((prev) => ({
                ...prev,
                confidentialityTermType: "fixed",
              }))
            }
          />
          <input
            className={`${inputClasses} w-32`}
            value={data.confidentialityTermDuration}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                confidentialityTermDuration: e.target.value,
              }))
            }
            disabled={data.confidentialityTermType !== "fixed"}
          />
          from effective date (trade secrets survive until no longer secret)
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
          <input
            type="radio"
            name="confidentialityTermType"
            checked={data.confidentialityTermType === "perpetuity"}
            onChange={() =>
              onChange((prev) => ({
                ...prev,
                confidentialityTermType: "perpetuity",
              }))
            }
          />
          In perpetuity
        </label>
      </fieldset>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Governing law (state)">
          <input
            className={inputClasses}
            value={data.governingLaw}
            onChange={(e) =>
              onChange((prev) => ({ ...prev, governingLaw: e.target.value }))
            }
            placeholder="Delaware"
          />
        </Field>
        <Field label="Jurisdiction (city/county, state)">
          <input
            className={inputClasses}
            value={data.jurisdiction}
            onChange={(e) =>
              onChange((prev) => ({ ...prev, jurisdiction: e.target.value }))
            }
            placeholder="New Castle, DE"
          />
        </Field>
      </div>

      <Field label="Modifications (optional)">
        <textarea
          className={inputClasses}
          rows={2}
          value={data.modifications}
          onChange={(e) =>
            onChange((prev) => ({ ...prev, modifications: e.target.value }))
          }
          placeholder="List any modifications to the standard terms"
        />
      </Field>
    </form>
  );
}
