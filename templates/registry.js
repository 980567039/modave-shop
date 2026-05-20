import modaveTemplate from "@/templates/modave/template.config";

export const templates = {
  modave: modaveTemplate,
};

export function getActiveTemplateId(
  templateId = process.env.NEXT_PUBLIC_ACTIVE_TEMPLATE || process.env.TEMPLATE_ID || "modave"
) {
  return templates[templateId] ? templateId : "modave";
}

export function getActiveTemplate(templateId = process.env.NEXT_PUBLIC_ACTIVE_TEMPLATE || "modave") {
  return templates[getActiveTemplateId(templateId)] || templates.modave;
}
