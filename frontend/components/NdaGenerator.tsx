"use client";

import { useMemo, useState } from "react";
import NdaForm from "@/components/NdaForm";
import NdaPreview from "@/components/NdaPreview";
import {
  assembleDocument,
  buildDownloadFilename,
  createDefaultFormData,
  fillCoverPage,
  isNdaFormComplete,
} from "@/lib/nda-template";

export default function NdaGenerator({
  coverPageTemplate,
  standardTerms,
}: {
  coverPageTemplate: string;
  standardTerms: string;
}) {
  const [formData, setFormData] = useState(createDefaultFormData);

  const documentText = useMemo(() => {
    const filledCoverPage = fillCoverPage(coverPageTemplate, formData);
    return assembleDocument(filledCoverPage, standardTerms);
  }, [coverPageTemplate, standardTerms, formData]);

  const isComplete = isNdaFormComplete(formData);

  const handleDownload = () => {
    const blob = new Blob([documentText], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = buildDownloadFilename(formData);
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <NdaForm data={formData} onChange={setFormData} />
      <div className="lg:sticky lg:top-10 lg:self-start">
        <NdaPreview
          document={documentText}
          isComplete={isComplete}
          onDownload={handleDownload}
        />
      </div>
    </div>
  );
}
