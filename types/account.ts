export type PublicAccount = {
  name: string;
  email: string;
  role: "super_admin" | "admin" | "client";
  roleLabel: string;
  dashboardHref: string;
  initials: string;
};
