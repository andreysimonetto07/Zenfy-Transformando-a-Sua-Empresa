/** Public business contact. SMTP credentials belong only in Supabase settings. */
export const SUPPORT_EMAIL = "agenciazenfy@gmail.com";
export const SUPPORT_EMAIL_HREF = `mailto:${SUPPORT_EMAIL}`;

export const BUSINESS_CONTACT = {
  name: "Pedro Henrique",
  role: "Estratégia, Marketing & Desenvolvimento de Negócios",
  initials: "PH",
  phone: "+55 45 9812-2270",
  whatsapp: "554598122270",
} as const;

export const ANDREY_CONTACT = {
  name: "Andrey Simoneto",
  role: "Desenvolvimento Web & Soluções Digitais",
  initials: "AS",
  phone: "+55 45 99840-6220",
  whatsapp: "5545998406220",
} as const;

export const BUSINESS_CONTACTS = [ANDREY_CONTACT, BUSINESS_CONTACT] as const;
export type BusinessContact = (typeof BUSINESS_CONTACTS)[number];

export function whatsappHref(message: string, contact: BusinessContact = BUSINESS_CONTACT) {
  return `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(message)}`;
}
