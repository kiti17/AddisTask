export function getProviderTrustSummary(provider = {}) {
  const requirements = provider.trust_requirements || [
    {
      key: "bio",
      label: "Profile bio",
      complete: Boolean(provider.bio && provider.bio.trim().length >= 20),
      detail: "Describe experience, tools, and service quality.",
    },
    {
      key: "experience_years",
      label: "Experience",
      complete: Number(provider.experience_years || 0) > 0,
      detail: "Add at least one year of relevant experience.",
    },
    {
      key: "service_area",
      label: "Service areas",
      complete: Boolean(provider.service_area && provider.service_area.trim()),
      detail: "List the Addis Ababa areas this provider serves.",
    },
    {
      key: "availability",
      label: "Availability",
      complete: Boolean(provider.availability && provider.availability.trim()),
      detail: "Tell customers when the provider can work.",
    },
    {
      key: "contact_phone",
      label: "Contact phone",
      complete: Boolean(provider.contact_phone && provider.contact_phone.trim()),
      detail: "Provide a phone number admin can verify.",
    },
    {
      key: "id_verification_status",
      label: "ID submitted",
      complete: provider.id_verification_status === "submitted",
      detail: "Provider must submit basic identity details for review.",
    },
  ];
  const completed = requirements.filter((requirement) => requirement.complete).length;
  const total = requirements.length || 1;
  const score = Number.isFinite(provider.trust_score)
    ? provider.trust_score
    : Math.round((completed / total) * 100);
  const missing = provider.missing_trust_requirements ||
    requirements
      .filter((requirement) => !requirement.complete)
      .map((requirement) => requirement.label);

  return {
    requirements,
    score,
    missing,
    ready: provider.trust_ready ?? (missing.length === 0),
    level: provider.trust_level || (missing.length === 0
      ? "Ready for admin review"
      : "Needs trust details"),
  };
}

export function getTrustPillClass(score) {
  if (score >= 100) return "complete";
  if (score >= 70) return "partial";
  return "low";
}
