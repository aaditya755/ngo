export const APP_ROLES = [
  "ADMIN",
  "NGO_COORDINATOR",
  "FIELD_WORKER",
  "VOLUNTEER",
  "DONOR",
] as const;

export type AppRole = (typeof APP_ROLES)[number];

export const DEFAULT_ROLE: AppRole = "VOLUNTEER";

export const ROLE_DASHBOARD_PATHS: Record<AppRole, string> = {
  ADMIN: "/dashboard/admin",
  NGO_COORDINATOR: "/dashboard/ngo",
  FIELD_WORKER: "/dashboard/field-worker",
  VOLUNTEER: "/dashboard/volunteer",
  DONOR: "/dashboard/donor",
};

export const ROLE_LABELS: Record<AppRole, string> = {
  ADMIN: "Admin",
  NGO_COORDINATOR: "NGO Coordinator",
  FIELD_WORKER: "Field Worker",
  VOLUNTEER: "Volunteer",
  DONOR: "Donor",
};

const DASHBOARD_ROUTE_MATCHERS: Array<{ path: string; role: AppRole }> = [
  { path: "/dashboard/admin", role: "ADMIN" },
  { path: "/dashboard/ngo", role: "NGO_COORDINATOR" },
  { path: "/dashboard/field-worker", role: "FIELD_WORKER" },
  { path: "/dashboard/volunteer", role: "VOLUNTEER" },
  { path: "/dashboard/donor", role: "DONOR" },
];

export function isAppRole(role: string | null | undefined): role is AppRole {
  return APP_ROLES.includes((role ?? "") as AppRole);
}

export function normalizeRole(role: string | null | undefined): AppRole {
  return isAppRole(role) ? role : DEFAULT_ROLE;
}

export function getDashboardPathForRole(role: string | null | undefined) {
  return ROLE_DASHBOARD_PATHS[normalizeRole(role)];
}

export function getRequiredRoleForDashboardPath(pathname: string) {
  const matched = DASHBOARD_ROUTE_MATCHERS.find(
    ({ path }) => pathname === path || pathname.startsWith(`${path}/`),
  );

  return matched?.role;
}
