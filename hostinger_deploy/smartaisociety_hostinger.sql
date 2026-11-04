-- =========================================================================
-- smartaisociety - Complete Production SQL Schema & Seed Dump
-- Optimized for Hostinger VPS KVM 2 Plan (Ubuntu 22.04/24.04 LTS / Debian 12)
-- Compatible with: MySQL 8.0+, MariaDB 10.11+, PostgreSQL 14+, SQLite WASM
-- Generated for: smartaisociety Next-Gen Residential ERP
-- =========================================================================

CREATE DATABASE IF NOT EXISTS smartaisociety_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE smartaisociety_db;

-- Drop child tables first to respect foreign key constraints
DROP TABLE IF EXISTS society_staff;
DROP TABLE IF EXISTS facility_bookings;
DROP TABLE IF EXISTS society_notices;
DROP TABLE IF EXISTS complaints;
DROP TABLE IF EXISTS water_audit_logs;
DROP TABLE IF EXISTS water_pumps;
DROP TABLE IF EXISTS water_tanks;
DROP TABLE IF EXISTS guard_checkpoints;
DROP TABLE IF EXISTS premises_visitors;
DROP TABLE IF EXISTS deliveries;
DROP TABLE IF EXISTS utility_invoices;
DROP TABLE IF EXISTS residents;
DROP TABLE IF EXISTS societies;

-- =========================================================================
-- 1. Societies Master Multi-Tenant Table
-- =========================================================================
CREATE TABLE societies (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  subdomain VARCHAR(64) UNIQUE NOT NULL,
  custom_domain VARCHAR(255),
  is_custom_domain_active TINYINT(1) DEFAULT 0,
  registration_number VARCHAR(128),
  gstin VARCHAR(64),
  address TEXT,
  city VARCHAR(128),
  pincode VARCHAR(32),
  total_flats INT DEFAULT 320,
  total_blocks INT DEFAULT 4,
  primary_color VARCHAR(16) DEFAULT '#059669',
  secondary_color VARCHAR(16) DEFAULT '#0f766e',
  logo_emblem VARCHAR(16) DEFAULT 'PG',
  admin_name VARCHAR(128),
  admin_email VARCHAR(128),
  admin_phone VARCHAR(32),
  admin_role VARCHAR(64) DEFAULT 'President',
  temporary_password VARCHAR(128),
  ssl_status VARCHAR(32) DEFAULT 'active',
  status VARCHAR(32) DEFAULT 'live',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_subdomain (subdomain),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================================
-- 2. Residents and Flats Directory Table
-- =========================================================================
CREATE TABLE residents (
  id VARCHAR(64) PRIMARY KEY,
  society_id VARCHAR(64) NOT NULL,
  unit VARCHAR(32) NOT NULL,
  block VARCHAR(32) NOT NULL,
  owner_name VARCHAR(128) NOT NULL,
  resident_type VARCHAR(32) DEFAULT 'Owner',
  phone VARCHAR(32),
  email VARCHAR(128),
  parking_slot VARCHAR(64),
  has_pets TINYINT(1) DEFAULT 0,
  status VARCHAR(32) DEFAULT 'active',
  INDEX idx_society_unit (society_id, unit),
  INDEX idx_owner_name (owner_name),
  FOREIGN KEY (society_id) REFERENCES societies(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================================
-- 3. Utility Invoices & Maintenance Ledger
-- =========================================================================
CREATE TABLE utility_invoices (
  id VARCHAR(64) PRIMARY KEY,
  society_id VARCHAR(64) NOT NULL,
  unit VARCHAR(32) NOT NULL,
  resident_name VARCHAR(128) NOT NULL,
  billing_period VARCHAR(64) NOT NULL,
  due_date VARCHAR(32) NOT NULL,
  status VARCHAR(32) DEFAULT 'Pending',
  society_maintenance_amount DECIMAL(10,2) DEFAULT 2400.00,
  electricity_dg_amount DECIMAL(10,2) DEFAULT 1100.00,
  water_utility_amount DECIMAL(10,2) DEFAULT 750.00,
  total_amount DECIMAL(10,2) NOT NULL,
  paid_at VARCHAR(64),
  payment_method VARCHAR(32),
  transaction_id VARCHAR(128),
  receipt_hash VARCHAR(128),
  INDEX idx_society_status (society_id, status),
  INDEX idx_unit (unit),
  INDEX idx_billing_period (billing_period),
  FOREIGN KEY (society_id) REFERENCES societies(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================================
-- 4. Deliveries Pre-Approval & Courier Registry
-- =========================================================================
CREATE TABLE deliveries (
  id VARCHAR(64) PRIMARY KEY,
  society_id VARCHAR(64) NOT NULL,
  unit VARCHAR(32) NOT NULL,
  carrier VARCHAR(64) NOT NULL,
  passcode VARCHAR(16) NOT NULL,
  status VARCHAR(32) DEFAULT 'Pre-Approved',
  permission VARCHAR(64) DEFAULT 'Allow to Doorstep',
  notes TEXT,
  expected_window VARCHAR(128),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  admitted_at VARCHAR(64),
  delivered_at VARCHAR(64),
  INDEX idx_society_passcode (society_id, passcode),
  INDEX idx_delivery_status (status),
  FOREIGN KEY (society_id) REFERENCES societies(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================================
-- 5. Premises Visitors & Smart Gate Logs
-- =========================================================================
CREATE TABLE premises_visitors (
  id VARCHAR(64) PRIMARY KEY,
  society_id VARCHAR(64) NOT NULL,
  unit VARCHAR(32) NOT NULL,
  visitor_name VARCHAR(128) NOT NULL,
  visitor_phone VARCHAR(32),
  visitor_type VARCHAR(64) DEFAULT 'Guest',
  vehicle_number VARCHAR(32),
  status VARCHAR(32) DEFAULT 'Inside',
  entry_gate VARCHAR(64) DEFAULT 'Gate 01',
  entry_time VARCHAR(64),
  exit_time VARCHAR(64),
  INDEX idx_society_visitor_status (society_id, status),
  FOREIGN KEY (society_id) REFERENCES societies(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================================
-- 6. Guard Geofence Checkpoints & NFC Patrol
-- =========================================================================
CREATE TABLE guard_checkpoints (
  id VARCHAR(64) PRIMARY KEY,
  society_id VARCHAR(64) NOT NULL,
  name VARCHAR(128) NOT NULL,
  location VARCHAR(255) NOT NULL,
  qr_payload TEXT NOT NULL,
  nfc_tag_id VARCHAR(64) NOT NULL,
  lat DECIMAL(10,6),
  lng DECIMAL(10,6),
  radius_meters INT DEFAULT 25,
  status VARCHAR(32) DEFAULT 'pending',
  last_scanned_time VARCHAR(64),
  scanned_by VARCHAR(128),
  INDEX idx_society_checkpoint (society_id, status),
  FOREIGN KEY (society_id) REFERENCES societies(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================================
-- 7. Water IoT Reservoirs & Tanks
-- =========================================================================
CREATE TABLE water_tanks (
  id VARCHAR(64) PRIMARY KEY,
  society_id VARCHAR(64) NOT NULL,
  name VARCHAR(128) NOT NULL,
  location VARCHAR(255) NOT NULL,
  capacity_litres INT NOT NULL,
  current_litres INT NOT NULL,
  level_percentage INT NOT NULL,
  sensor_type VARCHAR(64) DEFAULT 'Ultrasonic MQTT',
  sensor_health VARCHAR(32) DEFAULT 'Optimal',
  last_sensor_ping VARCHAR(64) DEFAULT 'Just now',
  status VARCHAR(32) DEFAULT 'normal',
  INDEX idx_society_tank (society_id),
  FOREIGN KEY (society_id) REFERENCES societies(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================================
-- 8. Water IoT Motor Pumps & Relays
-- =========================================================================
CREATE TABLE water_pumps (
  id VARCHAR(64) PRIMARY KEY,
  society_id VARCHAR(64) NOT NULL,
  name VARCHAR(128) NOT NULL,
  type VARCHAR(128) NOT NULL,
  source_tank_id VARCHAR(64) NOT NULL,
  target_tank_id VARCHAR(64) NOT NULL,
  state VARCHAR(32) DEFAULT 'IDLE',
  flow_rate_lpm INT DEFAULT 180,
  power_kw DECIMAL(5,2) DEFAULT 7.5,
  voltage_v INT DEFAULT 415,
  last_state_changed VARCHAR(64) DEFAULT 'Just now',
  INDEX idx_society_pump (society_id, state),
  FOREIGN KEY (society_id) REFERENCES societies(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================================
-- 9. Water Audit Logs & Automated Failsafe History
-- =========================================================================
CREATE TABLE water_audit_logs (
  id VARCHAR(64) PRIMARY KEY,
  society_id VARCHAR(64) NOT NULL,
  action VARCHAR(64) NOT NULL,
  pump_name VARCHAR(128) NOT NULL,
  tank_name VARCHAR(128) NOT NULL,
  level_percentage INT NOT NULL,
  operator VARCHAR(128) NOT NULL,
  trigger_type VARCHAR(64) NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_society_action (society_id, action)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================================
-- 10. Resident Complaints & Society Helpdesk Tickets
-- =========================================================================
CREATE TABLE complaints (
  id VARCHAR(64) PRIMARY KEY,
  society_id VARCHAR(64) NOT NULL,
  unit VARCHAR(32) NOT NULL,
  resident_name VARCHAR(128) NOT NULL,
  category VARCHAR(64) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  priority VARCHAR(32) DEFAULT 'Medium',
  status VARCHAR(32) DEFAULT 'Open',
  assigned_to VARCHAR(128),
  resolution_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at VARCHAR(64),
  INDEX idx_society_complaint_status (society_id, status),
  INDEX idx_unit_complaint (unit),
  FOREIGN KEY (society_id) REFERENCES societies(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================================
-- 11. Society Circulars, Bulletins & Notice Board
-- =========================================================================
CREATE TABLE society_notices (
  id VARCHAR(64) PRIMARY KEY,
  society_id VARCHAR(64) NOT NULL,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(64) DEFAULT 'General',
  content TEXT NOT NULL,
  priority VARCHAR(32) DEFAULT 'Normal',
  posted_by VARCHAR(128) DEFAULT 'Managing Committee',
  valid_until VARCHAR(64),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_society_notices (society_id, priority),
  FOREIGN KEY (society_id) REFERENCES societies(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================================
-- 12. Amenity & Facility Bookings
-- =========================================================================
CREATE TABLE facility_bookings (
  id VARCHAR(64) PRIMARY KEY,
  society_id VARCHAR(64) NOT NULL,
  unit VARCHAR(32) NOT NULL,
  resident_name VARCHAR(128) NOT NULL,
  facility_name VARCHAR(128) NOT NULL,
  booking_date VARCHAR(64) NOT NULL,
  time_slot VARCHAR(64) NOT NULL,
  status VARCHAR(32) DEFAULT 'Confirmed',
  fee_amount DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_facility_date (society_id, facility_name, booking_date),
  FOREIGN KEY (society_id) REFERENCES societies(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================================
-- 13. Society Committee & Maintenance Staff
-- =========================================================================
CREATE TABLE society_staff (
  id VARCHAR(64) PRIMARY KEY,
  society_id VARCHAR(64) NOT NULL,
  name VARCHAR(128) NOT NULL,
  role VARCHAR(128) NOT NULL,
  phone VARCHAR(32) NOT NULL,
  email VARCHAR(128),
  status VARCHAR(32) DEFAULT 'Active',
  shift VARCHAR(32) DEFAULT 'General',
  INDEX idx_staff_role (society_id, role),
  FOREIGN KEY (society_id) REFERENCES societies(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =========================================================================
-- SEED DATA (Palm Greens Residency Flagship Tenant)
-- =========================================================================
INSERT INTO societies VALUES (
  'soc_pg_982', 'Palm Greens Residency RWA', 'palmgreens', 'portal.palmgreens-residency.org',
  1, 'BLR/RWA/2021/8841-A', '29AAAFP9821M1Z5', 'Survey No. 42/1, Sarjapur Main Road, Bellandur',
  'Bengaluru, Karnataka', '560103', 320, 4, '#059669', '#0f766e', 'PG',
  'Col. Rajeshwar Rao (Retd.)', 'president@palmgreens-residency.org', '+91 98450 12890',
  'President', 'PG-RWA-2026!Secured', 'active', 'live', NOW()
);

INSERT INTO residents VALUES
  ('res_101', 'soc_pg_982', 'A-101', 'Tower A', 'Vikram Malhotra', 'Owner', '+91 98450 11223', 'vikram.m@example.com', 'B1-P01', 0, 'active'),
  ('res_102', 'soc_pg_982', 'A-102', 'Tower A', 'Pooja Iyer', 'Tenant', '+91 98450 44556', 'pooja.i@example.com', 'B1-P02', 1, 'active'),
  ('res_402', 'soc_pg_982', 'B-402', 'Tower B', 'Sameer Verma', 'Owner', '+91 98450 99881', 'sameer.verma@example.com', 'B1-P24', 0, 'active'),
  ('res_403', 'soc_pg_982', 'B-403', 'Tower B', 'Dr. Arvind Patel', 'Owner', '+91 98450 33441', 'dr.patel@example.com', 'B1-P25', 0, 'active');

INSERT INTO utility_invoices VALUES
  ('inv_mar_402', 'soc_pg_982', 'B-402', 'Sameer Verma', 'March 2026', '2026-03-31', 'Pending', 2400.00, 1100.00, 750.00, 4250.00, NULL, NULL, NULL, 'SHA256-INV-MAR2026-B402-9981'),
  ('inv_mar_101', 'soc_pg_982', 'A-101', 'Vikram Malhotra', 'March 2026', '2026-03-31', 'Paid', 2400.00, 950.00, 680.00, 4030.00, '2026-03-25 11:20 AM', 'UPI', 'TXN-UPI-99281729', 'SHA256-INV-MAR2026-A101-7712'),
  ('inv_mar_102', 'soc_pg_982', 'A-102', 'Pooja Iyer', 'March 2026', '2026-03-31', 'Paid', 2400.00, 1250.00, 810.00, 4460.00, '2026-03-28 04:45 PM', 'Net Banking', 'TXN-HDFC-551928', 'SHA256-INV-MAR2026-A102-3341');

INSERT INTO deliveries VALUES
  ('del_1', 'soc_pg_982', 'B-402', 'Zomato', '5821', 'Pre-Approved', 'Allow to Doorstep', 'Food parcel. Ring bell once.', 'Expected in 30 mins', NOW(), NULL, NULL),
  ('del_2', 'soc_pg_982', 'A-102', 'Amazon', '9144', 'Pre-Approved', 'Leave at Gate', 'Carton delivery box. Leave with Guard Ram Singh.', 'Expected by 02:00 PM', NOW(), NULL, NULL);

INSERT INTO premises_visitors VALUES
  ('vis_1', 'soc_pg_982', 'A-102', 'Mahesh Kumar', '+91 98111 22334', 'Guest', 'KA-01-MJ-4820', 'Inside', 'Gate 01', '10:15 AM', NULL),
  ('vis_2', 'soc_pg_982', 'B-402', 'Sunil Electrician', '+91 98222 33445', 'Service / Vendor', 'KA-51-EX-1002', 'Inside', 'Gate 02', '11:40 AM', NULL);

INSERT INTO guard_checkpoints VALUES
  ('CP-01', 'soc_pg_982', 'Main Entrance Gate 01', 'Gatehouse Barrier Column', 'CIVIC:PALMGREENS:CP-01:VERIFIED', 'NFC-TAG-8841-GATE1', 12.9279, 77.6828, 25, 'cleared', '03:45 AM', 'Guard Ram Singh'),
  ('CP-02', 'soc_pg_982', 'Tower A Sub-Basement B1', 'Elevator Lobby Core Wall', 'CIVIC:PALMGREENS:CP-02:VERIFIED', 'NFC-TAG-8842-BASE1', 12.9282, 77.6831, 25, 'cleared', '03:52 AM', 'Guard Ram Singh'),
  ('CP-03', 'soc_pg_982', 'Perimeter Wall South-East', 'Corner Watch Pillar #4', 'CIVIC:PALMGREENS:CP-03:VERIFIED', 'NFC-TAG-8843-PERI4', 12.9275, 77.6835, 25, 'pending', 'Bypassed (Overdue)', 'Unassigned'),
  ('CP-04', 'soc_pg_982', 'Clubhouse & Swimming Pool', 'Pump Filtration Deck', 'CIVIC:PALMGREENS:CP-04:VERIFIED', 'NFC-TAG-8844-POOL1', 12.9286, 77.6825, 25, 'cleared', '04:12 AM', 'Guard Deepesh Das'),
  ('CP-05', 'soc_pg_982', 'STP Plant & DG Generator Bay', 'Heavy Utility Room #2', 'CIVIC:PALMGREENS:CP-05:VERIFIED', 'NFC-TAG-8845-STP02', 12.9271, 77.6820, 25, 'cleared', '04:20 AM', 'Guard Deepesh Das');

INSERT INTO water_tanks VALUES
  ('ug_sump', 'soc_pg_982', 'Underground Master Sump', 'Sub-Basement Level 2 Utility Yard', 180000, 151200, 84, 'Ultrasonic MQTT', 'Optimal', 'Just now', 'normal'),
  ('oht_tower_a', 'soc_pg_982', 'Overhead Tank - Tower A & B', 'Tower A Rooftop Core', 45000, 39600, 88, 'Pressure Differential Gauge', 'Optimal', 'Just now', 'normal'),
  ('oht_tower_b', 'soc_pg_982', 'Overhead Tank - Tower C & D', 'Tower C Rooftop Core', 45000, 41400, 92, 'Ultrasonic MQTT', 'Optimal', 'Just now', 'normal');

INSERT INTO water_pumps VALUES
  ('borewell_1', 'soc_pg_982', 'Submersible Borewell Pump #1', 'High-Pressure Heavy Submersible', 'ug_sump', 'oht_tower_a', 'RUNNING', 180, 7.5, 415, 'Just now'),
  ('booster_2', 'soc_pg_982', 'Booster Transfer Pump #2', 'Multi-Stage Centrifugal Booster', 'ug_sump', 'oht_tower_b', 'IDLE', 120, 5.5, 415, 'Just now');

INSERT INTO water_audit_logs (id, society_id, action, pump_name, tank_name, level_percentage, operator, trigger_type) VALUES
  ('log_w1', 'soc_pg_982', 'PUMP_ON', 'Submersible Borewell Pump #1', 'Overhead Tank - Tower A & B', 42, 'Ramesh (Shift Pump Operator)', 'Manual Staff Switch'),
  ('log_w2', 'soc_pg_982', 'AUTO_TRIP_SHUTOFF', 'Booster Transfer Pump #2', 'Overhead Tank - Tower C & D', 95, 'IoT Failsafe Relay Controller', 'IoT Automated Failsafe');

INSERT INTO complaints VALUES
  ('cmp_1', 'soc_pg_982', 'B-402', 'Sameer Verma', 'Plumbing', 'Low pressure in master bathroom line', 'Water flow from hot water inlet in master bath is significantly lower than normal since yesterday evening.', 'Medium', 'In Progress', 'Suresh Plumber', 'Valve pressure calibrated at riser 4B.', NOW(), NULL),
  ('cmp_2', 'soc_pg_982', 'A-102', 'Pooja Iyer', 'Electrical', 'Corridor light fixture flickering near elevator lobby', 'Ceiling recessed LED panel near Tower A 1st floor lobby core is flickering continuously.', 'Low', 'Open', 'Ramesh Electrician', NULL, NOW(), NULL),
  ('cmp_3', 'soc_pg_982', 'A-101', 'Vikram Malhotra', 'Elevator', 'Tower A Passenger Lift #1 door sensor delay', 'Elevator doors reopening multiple times before ascending. Requires calibration.', 'High', 'Resolved', 'Schindler AMC Team', 'Door optical safety curtain realigned and tested.', NOW(), '2026-03-29 11:00 AM'),
  ('cmp_4', 'soc_pg_982', 'B-403', 'Dr. Arvind Patel', 'Security', 'Intercom line buzzing sound during gate calls', 'Audio unclear when security calls for visitor verification.', 'Low', 'Open', 'Estate Helpdesk', NULL, NOW(), NULL);

INSERT INTO society_notices VALUES
  ('not_1', 'soc_pg_982', 'Annual General Body Meeting (AGM) 2026', 'Meeting', 'The 5th AGM of Palm Greens RWA will convene on Sunday, April 12th at 10:30 AM in the Main Clubhouse Banquet Hall. Financial audit statements and security upgrades will be presented.', 'Important', 'President - Col. Rajeshwar Rao', '2026-04-12', NOW()),
  ('not_2', 'soc_pg_982', 'Bi-Monthly Overhead Tank Cleaning Schedule', 'Maintenance', 'Overhead tanks for Tower A & B will undergo automated pressure washing and chlorination this Thursday from 10:00 AM to 02:00 PM. Water supply will be maintained via secondary booster.', 'Important', 'Estate Facility Manager', '2026-04-05', NOW()),
  ('not_3', 'soc_pg_982', 'Basement EV Charging Bay Protocol', 'General', 'Smart EV Charging Bays in B1 (P-24, P-25) are now active on dynamic load sharing. Please register your EV vehicle RFID card at the Estate Office.', 'Normal', 'Green Township Committee', '2026-04-30', NOW()),
  ('not_4', 'soc_pg_982', 'Spring Cultural Evening & Community Feast', 'Event', 'Join us on Saturday evening for the spring cultural musical night and dinner buffet at Central Lawn. Complimentary for all registered residents.', 'Normal', 'Cultural Secretary', '2026-04-15', NOW());

INSERT INTO facility_bookings VALUES
  ('fb_1', 'soc_pg_982', 'B-402', 'Sameer Verma', 'Clubhouse Party Hall', '2026-04-18', '06:00 PM - 10:30 PM', 'Confirmed', 3500.00, NOW()),
  ('fb_2', 'soc_pg_982', 'A-101', 'Vikram Malhotra', 'Tennis Court', '2026-04-05', '06:30 AM - 08:00 AM', 'Confirmed', 0.00, NOW()),
  ('fb_3', 'soc_pg_982', 'A-102', 'Pooja Iyer', 'Swimming Pool Slot', '2026-04-06', '05:00 PM - 06:30 PM', 'Confirmed', 0.00, NOW());

INSERT INTO society_staff VALUES
  ('stf_1', 'soc_pg_982', 'Col. Rajeshwar Rao (Retd.)', 'President', '+91 98450 12890', 'president@palmgreens-residency.org', 'Active', 'General'),
  ('stf_2', 'soc_pg_982', 'Sunil Nambiar', 'Estate Manager', '+91 98450 67112', 'estate.manager@palmgreens-residency.org', 'Active', 'General'),
  ('stf_3', 'soc_pg_982', 'Head Guard Ram Singh', 'Chief Security', '+91 98110 54321', 'security.gate1@palmgreens-residency.org', 'Active', 'Morning'),
  ('stf_4', 'soc_pg_982', 'Ramesh Sharma', 'Senior Electrician', '+91 98220 98765', 'maintenance@palmgreens-residency.org', 'Active', 'General'),
  ('stf_5', 'soc_pg_982', 'Suresh Kumar', 'Master Plumber', '+91 98330 43210', 'plumbing@palmgreens-residency.org', 'Active', 'General');

-- -------------------------------------------------------------------------
-- Table: visitor_invites (Gate OTP Verification & Resident Passes)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS visitor_invites (
  id VARCHAR(64) PRIMARY KEY,
  society_id VARCHAR(64) NOT NULL,
  unit VARCHAR(32) NOT NULL,
  resident_name VARCHAR(128) NOT NULL,
  resident_phone VARCHAR(32),
  visitor_name VARCHAR(128) NOT NULL,
  visitor_phone VARCHAR(32),
  visitor_type VARCHAR(64) DEFAULT 'Guest',
  company VARCHAR(128),
  otp_code VARCHAR(16) NOT NULL,
  vehicle_number VARCHAR(32),
  valid_from VARCHAR(64),
  valid_until VARCHAR(64),
  status VARCHAR(32) DEFAULT 'Pending_Verification',
  admitted_at VARCHAR(64),
  admitted_by_guard VARCHAR(128),
  entry_gate VARCHAR(64),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (society_id) REFERENCES societies(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO visitor_invites VALUES
  ('inv_101', 'soc_pg_982', 'B-402', 'Sameer Verma', '+91 98401 23456', 'Kishore Sharma (Guest)', '+91 98765 43210', 'Guest', 'Personal Guest', '7842', 'DL-3C-AZ-9912', '10:00 AM', '09:00 PM', 'Pending_Verification', NULL, NULL, NULL, NOW()),
  ('inv_102', 'soc_pg_982', 'A-102', 'Pooja Iyer', '+91 98401 23457', 'Sunil Kumar (Zomato)', '+91 98111 88899', 'Delivery', 'Zomato Food', '3591', 'KA-05-JK-1234', '12:00 PM', '02:00 PM', 'Pending_Verification', NULL, NULL, NULL, NOW()),
  ('inv_103', 'soc_pg_982', 'C-501', 'Amit Saxena', '+91 98401 23458', 'Rajesh Carpenter', '+91 98222 77766', 'Service Staff', 'Urban Company', '9124', 'MH-02-XY-4321', '02:00 PM', '06:00 PM', 'Pending_Verification', NULL, NULL, NULL, NOW());

-- -------------------------------------------------------------------------
-- Table: security_alerts (Panic Alarm, Forced Entry & Intrusion Broadcasts)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS security_alerts (
  id VARCHAR(64) PRIMARY KEY,
  society_id VARCHAR(64) NOT NULL,
  guard_id VARCHAR(64),
  guard_name VARCHAR(128),
  alert_type VARCHAR(64) NOT NULL,
  severity VARCHAR(32) DEFAULT 'CRITICAL',
  location VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  intruder_details TEXT,
  status VARCHAR(32) DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at VARCHAR(64),
  resolved_by VARCHAR(128),
  FOREIGN KEY (society_id) REFERENCES societies(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO security_alerts VALUES
  ('alt_1', 'soc_pg_982', 'guard_01', 'Ram Singh (Gate 01)', 'FORCED_ENTRY', 'CRITICAL', 'Gate 01 - Main Entrance Barrier', 'Unidentified black SUV tried to force bypass entry barrier without resident OTP authorization.', '{"vehicleNumber":"DL-08-BK-4091","personCount":2,"description":"Black SUV refused security check and attempted to ram gate barrier"}', 'ACTIVE', NOW(), NULL, NULL);

-- -------------------------------------------------------------------------
-- Table: guard_duty_profiles (On/Off Duty Status, GPS Geofencing & Vigilance)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS guard_duty_profiles (
  id VARCHAR(64) PRIMARY KEY,
  society_id VARCHAR(64) NOT NULL,
  name VARCHAR(128) NOT NULL,
  badge_number VARCHAR(64) NOT NULL,
  phone VARCHAR(32),
  assigned_gate VARCHAR(128) NOT NULL,
  is_online TINYINT(1) DEFAULT 1,
  duty_shift VARCHAR(64) DEFAULT 'Morning (06:00 - 14:00)',
  shift_started_at VARCHAR(64),
  current_lat DECIMAL(10,6) DEFAULT 12.927900,
  current_lng DECIMAL(10,6) DEFAULT 77.682800,
  is_within_geofence TINYINT(1) DEFAULT 1,
  distance_from_post_meters INT DEFAULT 3,
  last_gps_ping TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  master_photo_url TEXT,
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_face_verified_at VARCHAR(64),
  next_verification_due_minutes INT DEFAULT 52,
  face_verification_status VARCHAR(32) DEFAULT 'VERIFIED',
  last_verification_confidence DECIMAL(5,2) DEFAULT 95.80,
  battery_level INT DEFAULT 88,
  FOREIGN KEY (society_id) REFERENCES societies(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO guard_duty_profiles VALUES
  ('guard_01', 'soc_pg_982', 'Ram Singh', 'SEC-0891', '+91 98110 54321', 'Gate 01 - Main Entrance Barrier', 1, 'Morning (06:00 - 14:00)', '06:00 AM', 12.927900, 77.682800, 1, 3, NOW(), 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80', NOW(), '08:00 AM', 45, 'VERIFIED', 96.40, 91),
  ('guard_02', 'soc_pg_982', 'Deepesh Das', 'SEC-0892', '+91 98110 54322', 'Gate 02 - Service & Tower C Gate', 1, 'Morning (06:00 - 14:00)', '06:00 AM', 12.927100, 77.682000, 1, 5, NOW(), 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80', NOW(), '08:15 AM', 52, 'VERIFIED', 94.80, 84);

-- -------------------------------------------------------------------------
-- Table: guard_face_verification_logs (Hourly Vigilance Biometric AI Check)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS guard_face_verification_logs (
  id VARCHAR(64) PRIMARY KEY,
  society_id VARCHAR(64) NOT NULL,
  guard_id VARCHAR(64) NOT NULL,
  guard_name VARCHAR(128) NOT NULL,
  captured_photo_url TEXT NOT NULL,
  master_photo_url TEXT NOT NULL,
  match_score DECIMAL(5,2) NOT NULL,
  status VARCHAR(32) NOT NULL,
  verification_notes TEXT,
  verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  operator_type VARCHAR(64) DEFAULT 'AUTO_AI_MATCH',
  FOREIGN KEY (society_id) REFERENCES societies(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO guard_face_verification_logs VALUES
  ('fvl_1', 'soc_pg_982', 'guard_01', 'Ram Singh', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80', 96.40, 'PASSED', 'Biometric facial geometric landmarks (pupillary distance, nasal-chin bridge) verified. Dress/hair ignored.', NOW(), 'AUTO_AI_MATCH');

-- -------------------------------------------------------------------------
-- Table: drone_scheduled_patrols (Active Deterrence Scheduled Aerial Patrols)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS drone_scheduled_patrols (
  id VARCHAR(64) PRIMARY KEY,
  society_id VARCHAR(64) NOT NULL,
  patrol_name VARCHAR(255) NOT NULL,
  patrol_time VARCHAR(64) NOT NULL,
  frequency VARCHAR(64) DEFAULT 'Daily Nightly',
  flight_path TEXT NOT NULL,
  sensor_payload VARCHAR(255) DEFAULT 'Optical 4K + FLIR Thermal + 12000lm Strobe',
  altitude_m INT DEFAULT 45,
  status VARCHAR(32) DEFAULT 'Active',
  last_run VARCHAR(64),
  next_run VARCHAR(64),
  FOREIGN KEY (society_id) REFERENCES societies(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO drone_scheduled_patrols VALUES
  ('dsp_1', 'soc_pg_982', '02:00 AM North Perimeter & Shrubbery Sweep', '02:00 AM', 'Daily Nightly', 'North Boundary Wall -> East Gate 02 -> Dense Shrubbery Zone -> Tower A Base', 'Optical 4K + FLIR Thermal + 12000lm Strobe', 45, 'Active', 'Yesterday 02:00 AM', 'Tonight 02:00 AM'),
  ('dsp_2', 'soc_pg_982', '04:30 AM High-Rise Terrace & Roof Blindspots', '04:30 AM', 'Daily Nightly', 'Clubhouse Roof Helipad -> Towers A-D Terraces -> Solar Inverter Array', 'Optical 4K + FLIR Thermal Dual Gimbal', 55, 'Active', 'Yesterday 04:30 AM', 'Tonight 04:30 AM'),
  ('dsp_3', 'soc_pg_982', '23:00 PM Olympic Pool & Sports Arena Perimeter', '23:00 PM', 'Daily Nightly', 'Sports Arena Mezzanine -> Pool Deck -> Children Play Area', 'Optical 4K + Acoustic Deterrent', 35, 'Active', 'Yesterday 23:00 PM', 'Tonight 23:00 PM');

-- -------------------------------------------------------------------------
-- Table: drone_flight_logs (Automated Audit Trails & RWA Investigation Records)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS drone_flight_logs (
  id VARCHAR(64) PRIMARY KEY,
  society_id VARCHAR(64) NOT NULL,
  mission_id VARCHAR(64) NOT NULL,
  mission_type VARCHAR(64) NOT NULL,
  trigger_source VARCHAR(255) NOT NULL,
  drone_callsign VARCHAR(64) DEFAULT 'SKY-SENTINEL-01',
  drone_model VARCHAR(128) DEFAULT 'AeroGuard 4K-FLIR Autonomous Quadcopter',
  start_time VARCHAR(64) NOT NULL,
  end_time VARCHAR(64),
  duration_seconds INT DEFAULT 280,
  perimeter_zone VARCHAR(255) NOT NULL,
  max_altitude_meters DECIMAL(5,2) DEFAULT 45.0,
  avg_speed_kmh DECIMAL(5,2) DEFAULT 28.5,
  battery_start_pct INT DEFAULT 100,
  battery_end_pct INT DEFAULT 76,
  threat_detected TINYINT(1) DEFAULT 0,
  threat_type VARCHAR(255),
  thermal_signature_detected TINYINT(1) DEFAULT 0,
  max_heat_temp_celsius DECIMAL(5,2),
  verification_status VARCHAR(64) DEFAULT 'VERIFIED_CLEARED',
  gps_coordinates_path TEXT,
  video_archive_url TEXT,
  guard_alerted VARCHAR(255),
  rwa_reviewed TINYINT(1) DEFAULT 0,
  rwa_remarks TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (society_id) REFERENCES societies(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO drone_flight_logs VALUES
  ('dlog_01', 'soc_pg_982', 'MSN-20261003-0214', 'PERIMETER_BREACH_RESPONSE', 'PIR Laser Tripwire #04 (North Boundary Wall)', 'SKY-SENTINEL-01', 'AeroGuard 4K-FLIR Autonomous Quadcopter', '2026-10-03 02:14:10', '2026-10-03 02:18:42', 272, 'North Boundary Wall · Pillar 14 Shrubbery', 42.00, 31.20, 98, 86, 1, 'Human Trespasser Heat Signature in Shrubbery', 1, 36.80, 'DETERRED_STROBE_ACTIVATED', '12.9281N, 77.6830E -> 12.9285N, 77.6834E', 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-41544-large.mp4', 'Guard Station 01 & Patrol Team Alpha', 1, 'Trespasser detected hiding in dense bougainvillea bushes using FLIR Thermal. 12,000-lumen strobe deterrent activated; intruder fled back across boundary wall before police dispatch needed.', NOW()),
  ('dlog_02', 'soc_pg_982', 'MSN-20261003-0430', 'SCHEDULED_AERIAL_PATROL', 'Scheduled 04:30 AM Autonomous Cron', 'SKY-SENTINEL-01', 'AeroGuard 4K-FLIR Autonomous Quadcopter', '2026-10-03 04:30:00', '2026-10-03 04:38:15', 495, 'High-Rise Rooftops & Solar Terrace Blindspots', 58.00, 26.40, 100, 78, 0, 'Routine Sweep - Clean Perimeter', 0, 18.40, 'VERIFIED_CLEARED', 'Towers A, B, C, D Terrace Circuit', 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-41544-large.mp4', 'Guard Station 01 Head Guard Ram Singh', 1, 'Terrace fire exits locked, solar panel farm intact, zero unauthorized rooftop presence.', NOW()),
  ('dlog_03', 'soc_pg_982', 'MSN-20261004-0105', 'PERIMETER_BREACH_RESPONSE', 'CCTV Tripwire Cam #12 (Back Service Gate)', 'SKY-SENTINEL-01', 'AeroGuard 4K-FLIR Autonomous Quadcopter', '2026-10-04 01:05:22', '2026-10-04 01:09:50', 268, 'Back Service Gate & Transformer Yard', 38.50, 29.80, 92, 82, 0, 'Stray Dog / False Alarm Heat Source', 1, 38.20, 'FALSE_ALARM', '12.9268N, 77.6815E', 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-41544-large.mp4', 'Patrol Guard Deepesh Das', 1, 'Thermal anomaly verified by drone camera as stray animal passing outer trench. No human breach.', NOW());


