/** Public business contact. SMTP credentials belong only in Supabase settings. */
export const SUPPORT_EMAIL = "agenciazenfy@gmail.com";
export const SUPPORT_EMAIL_HREF = `mailto:${SUPPORT_EMAIL}`;

export const BUSINESS_CONTACT = {
  name: "Pedro Henrique",
  role: "Estratégia, Marketing & Desenvolvimento de Negócios",
  phone: "+55 45 9812-2270",
  whatsapp: "554598122270",
} as const;

export function whatsappHref(message: string) {
  return `https://wa.me/${BUSINESS_CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;
}
