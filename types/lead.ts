import type { LeadStatus } from "@/lib/crm";

export type AdminProfile = { id: string; name: string; email?: string | null };
export type CompanySummary = {
  id: string;
  name: string;
  city?: string | null;
  state?: string | null;
  industry?: string | null;
  whatsapp?: string | null;
  phone?: string | null;
  email?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  website?: string | null;
  document?: string | null;
  notes?: string | null;
};

export type LeadRow = {
  id: string;
  company_id?: string | null;
  contact_name: string;
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  service?: string | null;
  source?: string | null;
  status: LeadStatus;
  notes?: string | null;
  assigned_to?: string | null;
  last_contact?: string | null;
  next_contact?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  companies?: CompanySummary | CompanySummary[] | null;
  assignee?: AdminProfile | AdminProfile[] | null;
};

export type ActivityRow = {
  id: string;
  action?: string | null;
  description?: string | null;
  created_at?: string | null;
  user_id?: string | null;
  author?: AdminProfile | AdminProfile[] | null;
};
