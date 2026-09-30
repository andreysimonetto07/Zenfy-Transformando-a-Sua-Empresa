import { z } from "zod";
import { CONTACT_TYPES, LEAD_SERVICES, LEAD_SOURCES, LEAD_STATUSES } from "@/lib/crm";

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  company: z.string().trim().max(120).optional().default(""),
  whatsapp: z.string().trim().min(8).max(30),
  email: z.string().trim().email().max(160),
  instagram: z.string().trim().max(80).optional().default(""),
  website: z.string().trim().max(200).optional().default(""),
  service: z.enum(["Site completo", "Landing Page", "Tráfego Pago", "Automação", "Criativos", "Copywriting", "Consultoria", "Outro"]),
  message: z.string().trim().max(2000).optional().default(""),
});
export type ContactInput = z.infer<typeof contactSchema>;

const optionalText = (max: number) => z.string().trim().max(max).optional().default("");
const optionalDateTime = z.union([z.string().datetime({ offset: true }), z.literal("")]).optional().default("");

export const leadSchema = z.object({
  id: z.string().uuid().optional(),
  company: z.string().trim().min(2).max(160),
  company_id: z.string().uuid().optional().or(z.literal("")),
  contact_name: z.string().trim().min(2).max(120),
  whatsapp: optionalText(30),
  phone: optionalText(30),
  email: z.union([z.string().trim().email().max(160), z.literal("")]).optional().default(""),
  instagram: optionalText(100),
  website: optionalText(240),
  city: optionalText(100),
  state: optionalText(60),
  industry: optionalText(100),
  service: z.enum(LEAD_SERVICES),
  source: z.enum(LEAD_SOURCES),
  status: z.enum(LEAD_STATUSES),
  assigned_to: z.string().uuid().optional().or(z.literal("")),
  notes: optionalText(4000),
  last_contact: optionalDateTime,
  next_contact: optionalDateTime,
});

export const statusSchema = z.object({ id: z.string().uuid(), status: z.enum(LEAD_STATUSES) });

export const contactActivitySchema = z.object({
  lead_id: z.string().uuid(),
  type: z.enum(CONTACT_TYPES),
  description: z.string().trim().min(2).max(2000),
  date: z.string().datetime({ offset: true }),
  next_contact: optionalDateTime,
});

export const companySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2).max(160),
  document: optionalText(40),
  industry: optionalText(100),
  phone: optionalText(30),
  whatsapp: optionalText(30),
  email: z.union([z.string().trim().email().max(160), z.literal("")]).optional().default(""),
  instagram: optionalText(100),
  facebook: optionalText(160),
  website: optionalText(240),
  city: optionalText(100),
  state: optionalText(60),
  notes: optionalText(4000),
});
