export type PortalRole = 'resident' | 'society_panel' | 'guard' | 'water' | 'provisioning';

export interface AuthUser {
  id: string;
  societyId: string;
  role: PortalRole;
  roleTitle: string;
  name: string;
  email: string;
  phone?: string;
  unit?: string;
  block?: string;
  badgeNumber?: string;
  gateId?: string;
  department?: string;
  avatarUrl?: string;
  token?: string;
  createdAt?: string;
}

export interface LoginCredentials {
  role: PortalRole;
  identifier: string; // email, phone, unit (e.g. A-101), badgeNumber, or admin id
  password?: string;
  gateId?: string;
}

export interface SignupPayload {
  role: PortalRole;
  societyId?: string;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  unit?: string;
  block?: string;
  residentType?: 'Owner' | 'Tenant';
  committeeRole?: string;
  badgeNumber?: string;
  gateId?: string;
  department?: string;
  clearanceLevel?: string;
}
