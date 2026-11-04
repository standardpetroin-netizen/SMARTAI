import initSqlJs, { Database } from 'sql.js';
import fs from 'fs';
import path from 'path';

let db: Database | null = null;
const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'smartaisociety.sqlite');

/**
 * Initialize SQLite Database using sql.js (WebAssembly)
 * Persists directly to disk at data/smartaisociety.sqlite
 */
export async function getDb(): Promise<Database> {
  if (db) return db;

  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    try {
      const fileBuffer = fs.readFileSync(DB_PATH);
      db = new SQL.Database(fileBuffer);
    } catch {
      db = new SQL.Database();
    }
  } else {
    db = new SQL.Database();
  }

  initSchema(db);
  saveDb(db);
  return db;
}

export function saveDb(database: Database): void {
  try {
    const data = database.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
  } catch (err) {
    console.error('Failed to persist SQLite DB:', err);
  }
}

/**
 * Creates relational SQL schema compatible with SQLite, MySQL and PostgreSQL
 */
function initSchema(database: Database) {
  database.run(`
    CREATE TABLE IF NOT EXISTS societies (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      subdomain TEXT UNIQUE NOT NULL,
      custom_domain TEXT,
      is_custom_domain_active INTEGER DEFAULT 0,
      registration_number TEXT,
      gstin TEXT,
      address TEXT,
      city TEXT,
      pincode TEXT,
      total_flats INTEGER DEFAULT 320,
      total_blocks INTEGER DEFAULT 4,
      primary_color TEXT DEFAULT '#059669',
      secondary_color TEXT DEFAULT '#0f766e',
      logo_emblem TEXT DEFAULT 'PG',
      admin_name TEXT,
      admin_email TEXT,
      admin_phone TEXT,
      admin_role TEXT DEFAULT 'President',
      temporary_password TEXT,
      ssl_status TEXT DEFAULT 'active',
      status TEXT DEFAULT 'live',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS residents (
      id TEXT PRIMARY KEY,
      society_id TEXT NOT NULL,
      unit TEXT NOT NULL,
      block TEXT NOT NULL,
      owner_name TEXT NOT NULL,
      resident_type TEXT DEFAULT 'Owner',
      phone TEXT,
      email TEXT,
      parking_slot TEXT,
      has_pets INTEGER DEFAULT 0,
      status TEXT DEFAULT 'active',
      FOREIGN KEY (society_id) REFERENCES societies(id)
    );

    CREATE TABLE IF NOT EXISTS utility_invoices (
      id TEXT PRIMARY KEY,
      society_id TEXT NOT NULL,
      unit TEXT NOT NULL,
      resident_name TEXT NOT NULL,
      billing_period TEXT NOT NULL,
      due_date TEXT NOT NULL,
      status TEXT DEFAULT 'Pending',
      society_maintenance_amount REAL DEFAULT 2400,
      electricity_dg_amount REAL DEFAULT 1100,
      water_utility_amount REAL DEFAULT 750,
      total_amount REAL NOT NULL,
      paid_at TEXT,
      payment_method TEXT,
      transaction_id TEXT,
      receipt_hash TEXT,
      FOREIGN KEY (society_id) REFERENCES societies(id)
    );

    CREATE TABLE IF NOT EXISTS deliveries (
      id TEXT PRIMARY KEY,
      society_id TEXT NOT NULL,
      unit TEXT NOT NULL,
      carrier TEXT NOT NULL,
      passcode TEXT NOT NULL,
      status TEXT DEFAULT 'Pre-Approved',
      permission TEXT DEFAULT 'Allow to Doorstep',
      notes TEXT,
      expected_window TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      admitted_at TEXT,
      delivered_at TEXT,
      FOREIGN KEY (society_id) REFERENCES societies(id)
    );

    CREATE TABLE IF NOT EXISTS premises_visitors (
      id TEXT PRIMARY KEY,
      society_id TEXT NOT NULL,
      unit TEXT NOT NULL,
      visitor_name TEXT NOT NULL,
      visitor_phone TEXT,
      visitor_type TEXT DEFAULT 'Guest',
      vehicle_number TEXT,
      status TEXT DEFAULT 'Inside',
      entry_gate TEXT DEFAULT 'Gate 01',
      entry_time TEXT DEFAULT CURRENT_TIMESTAMP,
      exit_time TEXT,
      FOREIGN KEY (society_id) REFERENCES societies(id)
    );

    CREATE TABLE IF NOT EXISTS guard_checkpoints (
      id TEXT PRIMARY KEY,
      society_id TEXT NOT NULL,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      qr_payload TEXT NOT NULL,
      nfc_tag_id TEXT NOT NULL,
      lat REAL,
      lng REAL,
      radius_meters INTEGER DEFAULT 25,
      status TEXT DEFAULT 'pending',
      last_scanned_time TEXT,
      scanned_by TEXT,
      FOREIGN KEY (society_id) REFERENCES societies(id)
    );

    CREATE TABLE IF NOT EXISTS water_tanks (
      id TEXT PRIMARY KEY,
      society_id TEXT NOT NULL,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      capacity_litres INTEGER NOT NULL,
      current_litres INTEGER NOT NULL,
      level_percentage INTEGER NOT NULL,
      sensor_type TEXT DEFAULT 'Ultrasonic MQTT',
      sensor_health TEXT DEFAULT 'Optimal',
      last_sensor_ping TEXT DEFAULT 'Just now',
      status TEXT DEFAULT 'normal',
      FOREIGN KEY (society_id) REFERENCES societies(id)
    );

    CREATE TABLE IF NOT EXISTS water_pumps (
      id TEXT PRIMARY KEY,
      society_id TEXT NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      source_tank_id TEXT NOT NULL,
      target_tank_id TEXT NOT NULL,
      state TEXT DEFAULT 'IDLE',
      flow_rate_lpm INTEGER DEFAULT 180,
      power_kw REAL DEFAULT 7.5,
      voltage_v INTEGER DEFAULT 415,
      last_state_changed TEXT DEFAULT 'Just now',
      FOREIGN KEY (society_id) REFERENCES societies(id)
    );

    CREATE TABLE IF NOT EXISTS water_audit_logs (
      id TEXT PRIMARY KEY,
      society_id TEXT NOT NULL,
      action TEXT NOT NULL,
      pump_name TEXT NOT NULL,
      tank_name TEXT NOT NULL,
      level_percentage INTEGER NOT NULL,
      operator TEXT NOT NULL,
      trigger_type TEXT NOT NULL,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS complaints (
      id TEXT PRIMARY KEY,
      society_id TEXT NOT NULL,
      unit TEXT NOT NULL,
      resident_name TEXT NOT NULL,
      category TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      priority TEXT DEFAULT 'Medium',
      status TEXT DEFAULT 'Open',
      assigned_to TEXT,
      resolution_notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      resolved_at TEXT,
      FOREIGN KEY (society_id) REFERENCES societies(id)
    );

    CREATE TABLE IF NOT EXISTS society_notices (
      id TEXT PRIMARY KEY,
      society_id TEXT NOT NULL,
      title TEXT NOT NULL,
      category TEXT DEFAULT 'General',
      content TEXT NOT NULL,
      priority TEXT DEFAULT 'Normal',
      posted_by TEXT DEFAULT 'Managing Committee',
      valid_until TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (society_id) REFERENCES societies(id)
    );

    CREATE TABLE IF NOT EXISTS facility_bookings (
      id TEXT PRIMARY KEY,
      society_id TEXT NOT NULL,
      unit TEXT NOT NULL,
      resident_name TEXT NOT NULL,
      facility_name TEXT NOT NULL,
      booking_date TEXT NOT NULL,
      time_slot TEXT NOT NULL,
      status TEXT DEFAULT 'Confirmed',
      fee_amount REAL DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (society_id) REFERENCES societies(id)
    );

    CREATE TABLE IF NOT EXISTS society_staff (
      id TEXT PRIMARY KEY,
      society_id TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      status TEXT DEFAULT 'Active',
      shift TEXT DEFAULT 'General',
      FOREIGN KEY (society_id) REFERENCES societies(id)
    );

    CREATE TABLE IF NOT EXISTS visitor_invites (
      id TEXT PRIMARY KEY,
      society_id TEXT NOT NULL,
      unit TEXT NOT NULL,
      resident_name TEXT NOT NULL,
      resident_phone TEXT,
      visitor_name TEXT NOT NULL,
      visitor_phone TEXT,
      visitor_type TEXT DEFAULT 'Guest',
      company TEXT,
      otp_code TEXT NOT NULL,
      vehicle_number TEXT,
      valid_from TEXT,
      valid_until TEXT,
      status TEXT DEFAULT 'Pending_Verification',
      admitted_at TEXT,
      admitted_by_guard TEXT,
      entry_gate TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (society_id) REFERENCES societies(id)
    );

    CREATE TABLE IF NOT EXISTS security_alerts (
      id TEXT PRIMARY KEY,
      society_id TEXT NOT NULL,
      guard_id TEXT,
      guard_name TEXT,
      alert_type TEXT NOT NULL,
      severity TEXT DEFAULT 'CRITICAL',
      location TEXT NOT NULL,
      description TEXT NOT NULL,
      intruder_details TEXT,
      status TEXT DEFAULT 'ACTIVE',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      resolved_at TEXT,
      resolved_by TEXT,
      FOREIGN KEY (society_id) REFERENCES societies(id)
    );

    CREATE TABLE IF NOT EXISTS guard_duty_profiles (
      id TEXT PRIMARY KEY,
      society_id TEXT NOT NULL,
      name TEXT NOT NULL,
      badge_number TEXT NOT NULL,
      phone TEXT,
      assigned_gate TEXT NOT NULL,
      is_online INTEGER DEFAULT 1,
      duty_shift TEXT DEFAULT 'Morning (06:00 - 14:00)',
      shift_started_at TEXT,
      current_lat REAL DEFAULT 12.9279,
      current_lng REAL DEFAULT 77.6828,
      is_within_geofence INTEGER DEFAULT 1,
      distance_from_post_meters INTEGER DEFAULT 3,
      last_gps_ping TEXT DEFAULT CURRENT_TIMESTAMP,
      master_photo_url TEXT,
      registered_at TEXT DEFAULT CURRENT_TIMESTAMP,
      last_face_verified_at TEXT,
      next_verification_due_minutes INTEGER DEFAULT 52,
      face_verification_status TEXT DEFAULT 'VERIFIED',
      last_verification_confidence REAL DEFAULT 95.8,
      battery_level INTEGER DEFAULT 88,
      FOREIGN KEY (society_id) REFERENCES societies(id)
    );

    CREATE TABLE IF NOT EXISTS guard_face_verification_logs (
      id TEXT PRIMARY KEY,
      society_id TEXT NOT NULL,
      guard_id TEXT NOT NULL,
      guard_name TEXT NOT NULL,
      captured_photo_url TEXT NOT NULL,
      master_photo_url TEXT NOT NULL,
      match_score REAL NOT NULL,
      status TEXT NOT NULL,
      verification_notes TEXT,
      verified_at TEXT DEFAULT CURRENT_TIMESTAMP,
      operator_type TEXT DEFAULT 'AUTO_AI_MATCH',
      FOREIGN KEY (society_id) REFERENCES societies(id)
    );

    CREATE TABLE IF NOT EXISTS guard_shift_assignments (
      id TEXT PRIMARY KEY,
      society_id TEXT NOT NULL,
      guard_id TEXT NOT NULL,
      guard_name TEXT NOT NULL,
      badge_number TEXT NOT NULL,
      shift_type TEXT NOT NULL,
      shift_timing TEXT NOT NULL,
      assigned_post TEXT NOT NULL,
      effective_date TEXT NOT NULL,
      status TEXT DEFAULT 'ACTIVE_ON_DUTY',
      auto_duty_sync INTEGER DEFAULT 1,
      assigned_by TEXT DEFAULT 'Chief Security Officer',
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (society_id) REFERENCES societies(id)
    );

    CREATE TABLE IF NOT EXISTS drone_flight_logs (
      id TEXT PRIMARY KEY,
      society_id TEXT NOT NULL,
      mission_id TEXT NOT NULL,
      mission_type TEXT NOT NULL,
      trigger_source TEXT NOT NULL,
      drone_callsign TEXT DEFAULT 'SKY-SENTINEL-01',
      drone_model TEXT DEFAULT 'AeroGuard 4K-FLIR Autonomous Quadcopter',
      start_time TEXT NOT NULL,
      end_time TEXT,
      duration_seconds INTEGER DEFAULT 280,
      perimeter_zone TEXT NOT NULL,
      max_altitude_meters REAL DEFAULT 45.0,
      avg_speed_kmh REAL DEFAULT 28.5,
      battery_start_pct INTEGER DEFAULT 100,
      battery_end_pct INTEGER DEFAULT 76,
      threat_detected INTEGER DEFAULT 0,
      threat_type TEXT,
      thermal_signature_detected INTEGER DEFAULT 0,
      max_heat_temp_celsius REAL,
      verification_status TEXT DEFAULT 'VERIFIED_CLEARED',
      gps_coordinates_path TEXT,
      video_archive_url TEXT,
      guard_alerted TEXT,
      rwa_reviewed INTEGER DEFAULT 0,
      rwa_remarks TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (society_id) REFERENCES societies(id)
    );

    CREATE TABLE IF NOT EXISTS drone_scheduled_patrols (
      id TEXT PRIMARY KEY,
      society_id TEXT NOT NULL,
      patrol_name TEXT NOT NULL,
      patrol_time TEXT NOT NULL,
      frequency TEXT DEFAULT 'Daily Nightly',
      flight_path TEXT NOT NULL,
      sensor_payload TEXT DEFAULT 'Optical 4K + FLIR Thermal + 12000lm Strobe',
      altitude_m INTEGER DEFAULT 45,
      status TEXT DEFAULT 'Active',
      last_run TEXT,
      next_run TEXT,
      FOREIGN KEY (society_id) REFERENCES societies(id)
    );

    CREATE TABLE IF NOT EXISTS colony_drone_connections (
      id TEXT PRIMARY KEY,
      society_id TEXT NOT NULL,
      manufacturer TEXT NOT NULL,
      model_name TEXT NOT NULL,
      serial_number TEXT NOT NULL,
      callsign TEXT DEFAULT 'SKY-SENTINEL-01',
      connection_protocol TEXT NOT NULL,
      api_endpoint_or_host TEXT,
      api_key_or_token TEXT,
      api_secret_or_pin TEXT,
      rtsp_video_stream_url TEXT,
      webrtc_signal_url TEXT,
      dock_station_id TEXT DEFAULT 'DOCK-NORTH-ROOF-01',
      telemetry_port INTEGER DEFAULT 14550,
      rth_latitude REAL DEFAULT 12.9282,
      rth_longitude REAL DEFAULT 77.6831,
      rth_altitude_meters REAL DEFAULT 45.0,
      geofence_radius_meters REAL DEFAULT 350.0,
      is_connected INTEGER DEFAULT 1,
      connection_status TEXT DEFAULT 'ONLINE_TELEMETRY_LINKED',
      ping_latency_ms INTEGER DEFAULT 18,
      signal_strength_pct INTEGER DEFAULT 99,
      firmware_version TEXT DEFAULT 'v08.01.02.04',
      last_heartbeat TEXT DEFAULT CURRENT_TIMESTAMP,
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (society_id) REFERENCES societies(id)
    );

    CREATE TABLE IF NOT EXISTS portal_users (
      id TEXT PRIMARY KEY,
      society_id TEXT NOT NULL,
      role TEXT NOT NULL,
      role_title TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      password TEXT NOT NULL,
      unit TEXT,
      block TEXT,
      badge_number TEXT,
      gate_id TEXT,
      department TEXT,
      avatar_url TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (society_id) REFERENCES societies(id)
    );
  `);

  // Seed default data if societies table is empty
  const countRes = database.exec(`SELECT count(*) as count FROM societies`);
  const count = countRes[0]?.values[0]?.[0] as number;
  if (!count || count === 0) {
    seedInitialData(database);
  }
}

function seedInitialData(database: Database) {
  database.run(`
    INSERT INTO societies (
      id, name, subdomain, custom_domain, is_custom_domain_active, registration_number,
      gstin, address, city, pincode, total_flats, total_blocks, primary_color,
      secondary_color, logo_emblem, admin_name, admin_email, admin_phone, admin_role,
      temporary_password, ssl_status, status
    ) VALUES (
      'soc_gh_982', 'Grand Heights Residential Society RWA', 'grandheights', 'portal.grandheights-residency.org',
      1, 'BLR/RWA/2021/8841-A', '29AAAFP9821M1Z5', 'Survey No. 42/1, Prime Residential Sector',
      'Bengaluru, Karnataka', '560103', 320, 4, '#059669', '#0f766e', 'GH',
      'Col. Rajeshwar Rao (Retd.)', 'president@grandheights-residency.org', '+91 98450 12890',
      'President', 'GH-RWA-2026!Secured', 'active', 'live'
    );

    INSERT INTO residents (id, society_id, unit, block, owner_name, resident_type, phone, email, parking_slot, has_pets) VALUES
      ('res_101', 'soc_gh_982', 'A-101', 'Tower A', 'Vikram Malhotra', 'Owner', '+91 98450 11223', 'vikram.m@example.com', 'B1-P01', 0),
      ('res_102', 'soc_gh_982', 'A-102', 'Tower A', 'Pooja Iyer', 'Tenant', '+91 98450 44556', 'pooja.i@example.com', 'B1-P02', 1),
      ('res_402', 'soc_gh_982', 'B-402', 'Tower B', 'Sameer Verma', 'Owner', '+91 98450 99881', 'sameer.verma@example.com', 'B1-P24', 0),
      ('res_403', 'soc_gh_982', 'B-403', 'Tower B', 'Dr. Arvind Patel', 'Owner', '+91 98450 33441', 'dr.patel@example.com', 'B1-P25', 0);

    INSERT INTO utility_invoices (
      id, society_id, unit, resident_name, billing_period, due_date, status,
      society_maintenance_amount, electricity_dg_amount, water_utility_amount, total_amount,
      receipt_hash
    ) VALUES (
      'inv_mar_402', 'soc_gh_982', 'B-402', 'Sameer Verma', 'March 2026', '2026-03-31', 'Pending',
      2400, 1100, 750, 4250, 'SHA256-INV-MAR2026-B402-9981'
    );

    INSERT INTO deliveries (id, society_id, unit, carrier, passcode, status, permission, notes, expected_window) VALUES
      ('del_1', 'soc_gh_982', 'B-402', 'Zomato', '5821', 'Pre-Approved', 'Allow to Doorstep', 'Food parcel. Ring bell once.', 'Expected in 30 mins'),
      ('del_2', 'soc_gh_982', 'A-102', 'Amazon', '9144', 'Pre-Approved', 'Leave at Gate', 'Carton delivery box. Leave with Guard Ram Singh.', 'Expected by 02:00 PM');

    INSERT INTO premises_visitors (id, society_id, unit, visitor_name, visitor_phone, visitor_type, vehicle_number, status, entry_gate) VALUES
      ('vis_1', 'soc_gh_982', 'A-102', 'Mahesh Kumar', '+91 98111 22334', 'Guest', 'KA-01-MJ-4820', 'Inside', 'Gate 01'),
      ('vis_2', 'soc_gh_982', 'B-402', 'Sunil Electrician', '+91 98222 33445', 'Service / Vendor', 'KA-51-EX-1002', 'Inside', 'Gate 02');

    INSERT INTO guard_checkpoints (id, society_id, name, location, qr_payload, nfc_tag_id, lat, lng, status, last_scanned_time, scanned_by) VALUES
      ('CP-01', 'soc_gh_982', 'Main Entrance Gate 01', 'Gatehouse Barrier Column', 'SMARTAISOCIETY:CP-01:VERIFIED', 'NFC-TAG-8841-GATE1', 12.9279, 77.6828, 'cleared', '03:45 AM', 'Guard Ram Singh'),
      ('CP-02', 'soc_gh_982', 'Tower A Sub-Basement B1', 'Elevator Lobby Core Wall', 'SMARTAISOCIETY:CP-02:VERIFIED', 'NFC-TAG-8842-BASE1', 12.9282, 77.6831, 'cleared', '03:52 AM', 'Guard Ram Singh'),
      ('CP-03', 'soc_gh_982', 'Perimeter Wall South-East', 'Corner Watch Pillar #4', 'SMARTAISOCIETY:CP-03:VERIFIED', 'NFC-TAG-8843-PERI4', 12.9275, 77.6835, 'pending', 'Bypassed (Overdue)', 'Unassigned'),
      ('CP-04', 'soc_gh_982', 'Clubhouse & Swimming Pool', 'Pump Filtration Deck', 'SMARTAISOCIETY:CP-04:VERIFIED', 'NFC-TAG-8844-POOL1', 12.9286, 77.6825, 'cleared', '04:12 AM', 'Guard Deepesh Das'),
      ('CP-05', 'soc_gh_982', 'STP Plant & DG Generator Bay', 'Heavy Utility Room #2', 'SMARTAISOCIETY:CP-05:VERIFIED', 'NFC-TAG-8845-STP02', 12.9271, 77.6820, 'cleared', '04:20 AM', 'Guard Deepesh Das');

    INSERT INTO water_tanks (id, society_id, name, location, capacity_litres, current_litres, level_percentage, sensor_type, sensor_health, status) VALUES
      ('ug_sump', 'soc_gh_982', 'Underground Master Sump', 'Sub-Basement Level 2 Utility Yard', 180000, 151200, 84, 'Ultrasonic MQTT', 'Optimal', 'normal'),
      ('oht_tower_a', 'soc_gh_982', 'Overhead Tank - Tower A & B', 'Tower A Rooftop Core', 45000, 39600, 88, 'Pressure Differential Gauge', 'Optimal', 'normal'),
      ('oht_tower_b', 'soc_gh_982', 'Overhead Tank - Tower C & D', 'Tower C Rooftop Core', 45000, 41400, 92, 'Ultrasonic MQTT', 'Optimal', 'normal');

    INSERT INTO water_pumps (id, society_id, name, type, source_tank_id, target_tank_id, state, flow_rate_lpm, power_kw, voltage_v) VALUES
      ('borewell_1', 'soc_gh_982', 'Submersible Borewell Pump #1', 'High-Pressure Heavy Submersible', 'ug_sump', 'oht_tower_a', 'RUNNING', 180, 7.5, 415),
      ('booster_2', 'soc_gh_982', 'Booster Transfer Pump #2', 'Multi-Stage Centrifugal Booster', 'ug_sump', 'oht_tower_b', 'IDLE', 120, 5.5, 415);

    INSERT INTO water_audit_logs (id, society_id, action, pump_name, tank_name, level_percentage, operator, trigger_type) VALUES
      ('log_w1', 'soc_gh_982', 'PUMP_ON', 'Submersible Borewell Pump #1', 'Overhead Tank - Tower A & B', 42, 'Ramesh (Shift Pump Operator)', 'Manual Staff Switch'),
      ('log_w2', 'soc_gh_982', 'AUTO_TRIP_SHUTOFF', 'Booster Transfer Pump #2', 'Overhead Tank - Tower C & D', 95, 'IoT Failsafe Relay Controller', 'IoT Automated Failsafe');

    INSERT INTO complaints (id, society_id, unit, resident_name, category, title, description, priority, status, assigned_to, resolution_notes) VALUES
      ('cmp_1', 'soc_gh_982', 'B-402', 'Sameer Verma', 'Plumbing', 'Low pressure in master bathroom line', 'Water flow from hot water inlet in master bath is significantly lower than normal since yesterday evening.', 'Medium', 'In Progress', 'Suresh Plumber', 'Valve pressure calibrated at riser 4B.'),
      ('cmp_2', 'soc_gh_982', 'A-102', 'Pooja Iyer', 'Electrical', 'Corridor light fixture flickering near elevator lobby', 'Ceiling recessed LED panel near Tower A 1st floor lobby core is flickering continuously.', 'Low', 'Open', 'Ramesh Electrician', NULL),
      ('cmp_3', 'soc_gh_982', 'A-101', 'Vikram Malhotra', 'Elevator', 'Tower A Passenger Lift #1 door sensor delay', 'Elevator doors reopening multiple times before ascending. Requires calibration.', 'High', 'Resolved', 'Schindler AMC Team', 'Door optical safety curtain realigned and tested.'),
      ('cmp_4', 'soc_gh_982', 'B-403', 'Dr. Arvind Patel', 'Security', 'Intercom line buzzing sound during gate calls', 'Audio unclear when security calls for visitor verification.', 'Low', 'Open', 'Estate Helpdesk', NULL);

    INSERT INTO society_notices (id, society_id, title, category, content, priority, posted_by, valid_until) VALUES
      ('not_1', 'soc_gh_982', 'Annual General Body Meeting (AGM) 2026', 'Meeting', 'The 5th AGM of Grand Heights RWA will convene on Sunday, April 12th at 10:30 AM in the Main Clubhouse Banquet Hall. Financial audit statements and security upgrades will be presented.', 'Important', 'President - Col. Rajeshwar Rao', '2026-04-12'),
      ('not_2', 'soc_gh_982', 'Bi-Monthly Overhead Tank Cleaning Schedule', 'Maintenance', 'Overhead tanks for Tower A & B will undergo automated pressure washing and chlorination this Thursday from 10:00 AM to 02:00 PM. Water supply will be maintained via secondary booster.', 'Important', 'Estate Facility Manager', '2026-04-05'),
      ('not_3', 'soc_gh_982', 'Basement EV Charging Bay Protocol', 'General', 'Smart EV Charging Bays in B1 (P-24, P-25) are now active on dynamic load sharing. Please register your EV vehicle RFID card at the Estate Office.', 'Normal', 'Green Township Committee', '2026-04-30'),
      ('not_4', 'soc_gh_982', 'Spring Cultural Evening & Community Feast', 'Event', 'Join us on Saturday evening for the spring cultural musical night and dinner buffet at Central Lawn. Complimentary for all registered residents.', 'Normal', 'Cultural Secretary', '2026-04-15');

    INSERT INTO facility_bookings (id, society_id, unit, resident_name, facility_name, booking_date, time_slot, status, fee_amount) VALUES
      ('fb_1', 'soc_gh_982', 'B-402', 'Sameer Verma', 'Clubhouse Party Hall', '2026-04-18', '06:00 PM - 10:30 PM', 'Confirmed', 3500.00),
      ('fb_2', 'soc_gh_982', 'A-101', 'Vikram Malhotra', 'Tennis Court', '2026-04-05', '06:30 AM - 08:00 AM', 'Confirmed', 0.00),
      ('fb_3', 'soc_gh_982', 'A-102', 'Pooja Iyer', 'Swimming Pool Slot', '2026-04-06', '05:00 PM - 06:30 PM', 'Confirmed', 0.00);

    INSERT INTO society_staff (id, society_id, name, role, phone, email, status, shift) VALUES
      ('stf_1', 'soc_gh_982', 'Col. Rajeshwar Rao (Retd.)', 'President', '+91 98450 12890', 'president@grandheights-residency.org', 'Active', 'General'),
      ('stf_2', 'soc_gh_982', 'Sunil Nambiar', 'Estate Manager', '+91 98450 67112', 'estate.manager@grandheights-residency.org', 'Active', 'General'),
      ('stf_3', 'soc_gh_982', 'Head Guard Ram Singh', 'Chief Security', '+91 98110 54321', 'security.gate1@grandheights-residency.org', 'Active', 'Morning'),
      ('stf_4', 'soc_gh_982', 'Ramesh Sharma', 'Senior Electrician', '+91 98220 98765', 'maintenance@grandheights-residency.org', 'Active', 'General'),
      ('stf_5', 'soc_gh_982', 'Suresh Kumar', 'Master Plumber', '+91 98330 43210', 'plumbing@grandheights-residency.org', 'Active', 'General');

    INSERT INTO visitor_invites (id, society_id, unit, resident_name, resident_phone, visitor_name, visitor_phone, visitor_type, company, otp_code, vehicle_number, valid_from, valid_until, status) VALUES
      ('inv_101', 'soc_gh_982', 'B-402', 'Sameer Verma', '+91 98401 23456', 'Kishore Sharma (Guest)', '+91 98765 43210', 'Guest', 'Personal Guest', '7842', 'DL-3C-AZ-9912', '10:00 AM', '09:00 PM', 'Pending_Verification'),
      ('inv_102', 'soc_gh_982', 'A-102', 'Pooja Iyer', '+91 98401 23457', 'Sunil Kumar (Zomato)', '+91 98111 88899', 'Delivery', 'Zomato Food', '3591', 'KA-05-JK-1234', '12:00 PM', '02:00 PM', 'Pending_Verification'),
      ('inv_103', 'soc_gh_982', 'C-501', 'Amit Saxena', '+91 98401 23458', 'Rajesh Carpenter', '+91 98222 77766', 'Service Staff', 'Urban Company', '9124', 'MH-02-XY-4321', '02:00 PM', '06:00 PM', 'Pending_Verification');

    INSERT INTO security_alerts (id, society_id, guard_id, guard_name, alert_type, severity, location, description, intruder_details, status) VALUES
      ('alt_1', 'soc_pg_982', 'guard_01', 'Ram Singh (Gate 01)', 'FORCED_ENTRY', 'CRITICAL', 'Gate 01 - Main Entrance Barrier', 'Unidentified black SUV tried to force bypass entry barrier without resident OTP authorization.', '{"vehicleNumber":"DL-08-BK-4091","personCount":2,"description":"Black SUV refused security check and attempted to ram gate barrier"}', 'ACTIVE');

    INSERT INTO guard_duty_profiles (id, society_id, name, badge_number, phone, assigned_gate, is_online, duty_shift, shift_started_at, current_lat, current_lng, is_within_geofence, distance_from_post_meters, master_photo_url, last_face_verified_at, next_verification_due_minutes, face_verification_status, last_verification_confidence, battery_level) VALUES
      ('guard_01', 'soc_pg_982', 'Ram Singh', 'SEC-0891', '+91 98110 54321', 'Gate 01 - Main Entrance Barrier', 1, 'Morning (06:00 - 14:00)', '06:00 AM', 12.9279, 77.6828, 1, 3, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80', '08:00 AM', 45, 'VERIFIED', 96.4, 91),
      ('guard_02', 'soc_pg_982', 'Deepesh Das', 'SEC-0892', '+91 98110 54322', 'Gate 02 - Service & Tower C Gate', 1, 'Morning (06:00 - 14:00)', '06:00 AM', 12.9271, 77.6820, 1, 5, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80', '08:15 AM', 52, 'VERIFIED', 94.8, 84);

    INSERT INTO guard_face_verification_logs (id, society_id, guard_id, guard_name, captured_photo_url, master_photo_url, match_score, status, verification_notes, operator_type) VALUES
      ('fvl_1', 'soc_pg_982', 'guard_01', 'Ram Singh', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80', 96.4, 'PASSED', 'Biometric facial geometric landmarks (pupillary distance, nasal-chin bridge) matched master reference profile.', 'AUTO_AI_MATCH');

    INSERT INTO guard_shift_assignments (id, society_id, guard_id, guard_name, badge_number, shift_type, shift_timing, assigned_post, effective_date, status, auto_duty_sync, assigned_by, notes) VALUES
      ('sft_1', 'soc_pg_982', 'guard_01', 'Ram Singh', 'SEC-0891', 'Morning', '06:00 - 14:00', 'Gate 01 - Main Entrance Barrier', '2026-10-04', 'ACTIVE_ON_DUTY', 1, 'Chief Security Officer', 'Boom barrier & visitor OTP access clearance'),
      ('sft_2', 'soc_pg_982', 'guard_02', 'Deepesh Das', 'SEC-0892', 'Evening', '14:00 - 22:00', 'Gate 02 - Service & Tower C Gate', '2026-10-04', 'SCHEDULED', 1, 'Chief Security Officer', 'Courier pre-approval & service bay watch');

    INSERT INTO drone_scheduled_patrols (id, society_id, patrol_name, patrol_time, frequency, flight_path, sensor_payload, altitude_m, status, last_run, next_run) VALUES
      ('dsp_1', 'soc_pg_982', '02:00 AM North Perimeter & Shrubbery Sweep', '02:00 AM', 'Daily Nightly', 'North Boundary Wall -> East Gate 02 -> Dense Shrubbery Zone -> Tower A Base', 'Optical 4K + FLIR Thermal + 12000lm Strobe', 45, 'Active', 'Yesterday 02:00 AM', 'Tonight 02:00 AM'),
      ('dsp_2', 'soc_pg_982', '04:30 AM High-Rise Terrace & Roof Blindspots', '04:30 AM', 'Daily Nightly', 'Clubhouse Roof Helipad -> Towers A-D Terraces -> Solar Inverter Array', 'Optical 4K + FLIR Thermal Dual Gimbal', 55, 'Active', 'Yesterday 04:30 AM', 'Tonight 04:30 AM'),
      ('dsp_3', 'soc_pg_982', '23:00 PM Olympic Pool & Sports Arena Perimeter', '23:00 PM', 'Daily Nightly', 'Sports Arena Mezzanine -> Pool Deck -> Children Play Area', 'Optical 4K + Acoustic Deterrent', 35, 'Active', 'Yesterday 23:00 PM', 'Tonight 23:00 PM');

    INSERT INTO drone_flight_logs (
      id, society_id, mission_id, mission_type, trigger_source, drone_callsign, drone_model,
      start_time, end_time, duration_seconds, perimeter_zone, max_altitude_meters, avg_speed_kmh,
      battery_start_pct, battery_end_pct, threat_detected, threat_type, thermal_signature_detected,
      max_heat_temp_celsius, verification_status, gps_coordinates_path, video_archive_url,
      guard_alerted, rwa_reviewed, rwa_remarks
    ) VALUES
      ('dlog_01', 'soc_pg_982', 'MSN-20261003-0214', 'PERIMETER_BREACH_RESPONSE', 'PIR Laser Tripwire #04 (North Boundary Wall)', 'SKY-SENTINEL-01', 'AeroGuard 4K-FLIR Autonomous Quadcopter', '2026-10-03 02:14:10', '2026-10-03 02:18:42', 272, 'North Boundary Wall · Pillar 14 Shrubbery', 42.0, 31.2, 98, 86, 1, 'Human Trespasser Heat Signature in Shrubbery', 1, 36.8, 'DETERRED_STROBE_ACTIVATED', '12.9281N, 77.6830E -> 12.9285N, 77.6834E', 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-41544-large.mp4', 'Guard Station 01 & Patrol Team Alpha', 1, 'Trespasser detected hiding in dense bougainvillea bushes using FLIR Thermal. 12,000-lumen strobe deterrent activated; intruder fled back across boundary wall before police dispatch needed.'),
      ('dlog_02', 'soc_pg_982', 'MSN-20261003-0430', 'SCHEDULED_AERIAL_PATROL', 'Scheduled 04:30 AM Autonomous Cron', 'SKY-SENTINEL-01', 'AeroGuard 4K-FLIR Autonomous Quadcopter', '2026-10-03 04:30:00', '2026-10-03 04:38:15', 495, 'High-Rise Rooftops & Solar Terrace Blindspots', 58.0, 26.4, 100, 78, 0, 'Routine Sweep - Clean Perimeter', 0, 18.4, 'VERIFIED_CLEARED', 'Towers A, B, C, D Terrace Circuit', 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-41544-large.mp4', 'Guard Station 01 Head Guard Ram Singh', 1, 'Terrace fire exits locked, solar panel farm intact, zero unauthorized rooftop presence.'),
      ('dlog_03', 'soc_pg_982', 'MSN-20261004-0105', 'PERIMETER_BREACH_RESPONSE', 'CCTV Tripwire Cam #12 (Back Service Gate)', 'SKY-SENTINEL-01', 'AeroGuard 4K-FLIR Autonomous Quadcopter', '2026-10-04 01:05:22', '2026-10-04 01:09:50', 268, 'Back Service Gate & Transformer Yard', 38.5, 29.8, 92, 82, 0, 'Stray Dog / False Alarm Heat Source', 1, 38.2, 'FALSE_ALARM', '12.9268N, 77.6815E', 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-41544-large.mp4', 'Patrol Guard Deepesh Das', 1, 'Thermal anomaly verified by drone camera as stray animal passing outer trench. No human breach.');

    INSERT INTO colony_drone_connections (
      id, society_id, manufacturer, model_name, serial_number, callsign,
      connection_protocol, api_endpoint_or_host, api_key_or_token, api_secret_or_pin,
      rtsp_video_stream_url, webrtc_signal_url, dock_station_id, telemetry_port,
      rth_latitude, rth_longitude, rth_altitude_meters, geofence_radius_meters,
      is_connected, connection_status, ping_latency_ms, signal_strength_pct,
      firmware_version, notes
    ) VALUES (
      'drone_conn_01', 'soc_pg_982', 'DJI Enterprise', 'DJI Matrice 350 RTK + Zenmuse H20N',
      'DJI-M350-RTK-99214', 'SKY-SENTINEL-01', 'DJI_CLOUD_API',
      'https://api-enterprise.dji.com/v2/fleet/soc_pg_982', 'dji_live_sec_99a8b1c4e2',
      'dji_secret_pin_4412', 'rtsp://192.168.1.188:8554/live/thermal', 'wss://video.dji-flighthub.com/webrtc/live',
      'DOCK-NORTH-ROOF-01', 14550, 12.9282, 77.6831, 45.0, 350.0,
      1, 'ONLINE_TELEMETRY_LINKED', 18, 99,
      'v08.01.02.04', 'Selected by Society Management Committee for 24/7 autonomous night security and rapid fence response.'
    );

    INSERT OR IGNORE INTO portal_users (id, society_id, role, role_title, name, email, phone, password, unit, block, badge_number, gate_id, department, avatar_url) VALUES
    ('usr_res_01', 'soc_pg_982', 'resident', 'Resident (Flat A-101)', 'Dr. Rajesh Sharma', 'rajesh.sharma@example.com', '+91 98401 23456', 'password123', 'A-101', 'Tower A', NULL, NULL, NULL, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'),
    ('usr_res_02', 'soc_pg_982', 'resident', 'Resident (Flat B-402)', 'Pooja Hegde', 'pooja.hegde@example.com', '+91 98112 34567', 'password123', 'B-402', 'Tower B', NULL, NULL, NULL, 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'),
    ('usr_rwa_01', 'soc_pg_982', 'society_panel', 'RWA Committee President', 'Mr. Anand Verma', 'president@smartaisociety.com', '+91 98220 11223', 'password123', 'A-501', 'Tower A', NULL, NULL, 'Managing Committee', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'),
    ('usr_rwa_02', 'soc_pg_982', 'society_panel', 'General Secretary', 'Mrs. Sunita Rao', 'secretary@smartaisociety.com', '+91 98330 22334', 'password123', 'B-204', 'Tower B', NULL, NULL, 'Managing Committee', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'),
    ('usr_grd_01', 'soc_pg_982', 'guard', 'Head Gate Security Officer', 'Officer Vikram Singh', 'vikram.singh@apexsecurity.in', '+91 98100 12345', '1234', NULL, NULL, 'SEC-0891', 'Gate 01', 'Perimeter & Access Control', 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&q=80'),
    ('usr_grd_02', 'soc_pg_982', 'guard', 'Security Officer (Gate 02)', 'Officer Deepesh Das', 'deepesh.das@apexsecurity.in', '+91 98110 54322', '1234', NULL, NULL, 'SEC-0892', 'Gate 02', 'Tower B Security', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'),
    ('usr_eng_01', 'soc_pg_982', 'water', 'Chief Facilities & SCADA Engineer', 'Er. Sandeep Rao', 'sandeep.rao@smartaisociety.com', '+91 98450 67890', '1234', NULL, NULL, 'ENG-W-104', NULL, 'Smart Water & Hydro-Mechanical', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80'),
    ('usr_adm_01', 'soc_pg_982', 'provisioning', 'Master Cloud Administrator', 'Master Admin', 'admin@smartaisociety.com', '+91 99000 88888', 'admin123', NULL, NULL, 'ADM-001', NULL, 'Global Operations', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80');
  `);
}

/**
 * Execute SQL query with parameter substitution and return mapped JSON rows
 */
export async function querySql(sql: string, params: (string | number | null)[] = []): Promise<Record<string, unknown>[]> {
  const database = await getDb();
  const stmt = database.prepare(sql);
  if (params.length > 0) {
    stmt.bind(params);
  }
  const rows: Record<string, unknown>[] = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

/**
 * Execute modifying SQL statement (INSERT, UPDATE, DELETE) and auto-persist
 */
export async function executeSql(sql: string, params: (string | number | null)[] = []): Promise<{ rowsAffected: number }> {
  const database = await getDb();
  database.run(sql, params);
  saveDb(database);
  return { rowsAffected: database.getRowsModified() };
}

/**
 * Export complete SQL dump formatted for MySQL / MariaDB / PostgreSQL
 */
export async function exportHostingerSqlDump(): Promise<string> {
  const database = await getDb();
  const societies = await querySql(`SELECT * FROM societies`);
  const residents = await querySql(`SELECT * FROM residents`);
  const invoices = await querySql(`SELECT * FROM utility_invoices`);
  const deliveries = await querySql(`SELECT * FROM deliveries`);
  const visitors = await querySql(`SELECT * FROM premises_visitors`);
  const checkpoints = await querySql(`SELECT * FROM guard_checkpoints`);
  const tanks = await querySql(`SELECT * FROM water_tanks`);
  const pumps = await querySql(`SELECT * FROM water_pumps`);
  const complaints = await querySql(`SELECT * FROM complaints`);
  const notices = await querySql(`SELECT * FROM society_notices`);
  const bookings = await querySql(`SELECT * FROM facility_bookings`);
  const staff = await querySql(`SELECT * FROM society_staff`);
  const invites = await querySql(`SELECT * FROM visitor_invites`);
  const alerts = await querySql(`SELECT * FROM security_alerts`);
  const guards = await querySql(`SELECT * FROM guard_duty_profiles`);
  const faceLogs = await querySql(`SELECT * FROM guard_face_verification_logs`);
  const shiftAssignments = await querySql(`SELECT * FROM guard_shift_assignments`);
  const droneLogs = await querySql(`SELECT * FROM drone_flight_logs`);
  const dronePatrols = await querySql(`SELECT * FROM drone_scheduled_patrols`);

  let dump = `-- =========================================================================\n`;
  dump += `-- smartaisociety - Complete MySQL/MariaDB Production Schema & Seed\n`;
  dump += `-- Ready for Production Cloud Servers (Ubuntu / Debian / CentOS)\n`;
  dump += `-- Generated on: ${new Date().toISOString()}\n`;
  dump += `-- =========================================================================\n\n`;

  dump += `CREATE DATABASE IF NOT EXISTS smartaisociety_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\n`;
  dump += `USE smartaisociety_db;\n\n`;

  dump += `DROP TABLE IF EXISTS drone_flight_logs;\n`;
  dump += `DROP TABLE IF EXISTS drone_scheduled_patrols;\n`;
  dump += `DROP TABLE IF EXISTS guard_shift_assignments;\n`;
  dump += `DROP TABLE IF EXISTS guard_face_verification_logs;\n`;
  dump += `DROP TABLE IF EXISTS guard_duty_profiles;\n`;
  dump += `DROP TABLE IF EXISTS security_alerts;\n`;
  dump += `DROP TABLE IF EXISTS visitor_invites;\n`;
  dump += `DROP TABLE IF EXISTS society_staff;\n`;
  dump += `DROP TABLE IF EXISTS facility_bookings;\n`;
  dump += `DROP TABLE IF EXISTS society_notices;\n`;
  dump += `DROP TABLE IF EXISTS complaints;\n`;
  dump += `DROP TABLE IF EXISTS water_audit_logs;\n`;
  dump += `DROP TABLE IF EXISTS water_pumps;\n`;
  dump += `DROP TABLE IF EXISTS water_tanks;\n`;
  dump += `DROP TABLE IF EXISTS guard_checkpoints;\n`;
  dump += `DROP TABLE IF EXISTS premises_visitors;\n`;
  dump += `DROP TABLE IF EXISTS deliveries;\n`;
  dump += `DROP TABLE IF EXISTS utility_invoices;\n`;
  dump += `DROP TABLE IF EXISTS residents;\n`;
  dump += `DROP TABLE IF EXISTS societies;\n\n`;

  dump += `CREATE TABLE societies (
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;

  dump += `CREATE TABLE residents (
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
  FOREIGN KEY (society_id) REFERENCES societies(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;

  dump += `CREATE TABLE utility_invoices (
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
  FOREIGN KEY (society_id) REFERENCES societies(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;

  dump += `CREATE TABLE deliveries (
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
  FOREIGN KEY (society_id) REFERENCES societies(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;

  dump += `CREATE TABLE premises_visitors (
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
  FOREIGN KEY (society_id) REFERENCES societies(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;

  dump += `CREATE TABLE guard_checkpoints (
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
  FOREIGN KEY (society_id) REFERENCES societies(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;

  dump += `CREATE TABLE water_tanks (
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
  FOREIGN KEY (society_id) REFERENCES societies(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;

  dump += `CREATE TABLE water_pumps (
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
  FOREIGN KEY (society_id) REFERENCES societies(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;

  dump += `CREATE TABLE complaints (
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
  FOREIGN KEY (society_id) REFERENCES societies(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;

  dump += `CREATE TABLE society_notices (
  id VARCHAR(64) PRIMARY KEY,
  society_id VARCHAR(64) NOT NULL,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(64) DEFAULT 'General',
  content TEXT NOT NULL,
  priority VARCHAR(32) DEFAULT 'Normal',
  posted_by VARCHAR(128) DEFAULT 'Managing Committee',
  valid_until VARCHAR(64),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (society_id) REFERENCES societies(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;

  dump += `CREATE TABLE facility_bookings (
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
  FOREIGN KEY (society_id) REFERENCES societies(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;

  dump += `CREATE TABLE society_staff (
  id VARCHAR(64) PRIMARY KEY,
  society_id VARCHAR(64) NOT NULL,
  name VARCHAR(128) NOT NULL,
  role VARCHAR(128) NOT NULL,
  phone VARCHAR(32) NOT NULL,
  email VARCHAR(128),
  status VARCHAR(32) DEFAULT 'Active',
  shift VARCHAR(32) DEFAULT 'General',
  FOREIGN KEY (society_id) REFERENCES societies(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;

  dump += `CREATE TABLE visitor_invites (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;

  dump += `CREATE TABLE security_alerts (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;

  dump += `CREATE TABLE guard_duty_profiles (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;

  dump += `CREATE TABLE guard_face_verification_logs (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;

  dump += `CREATE TABLE guard_shift_assignments (
  id VARCHAR(64) PRIMARY KEY,
  society_id VARCHAR(64) NOT NULL,
  guard_id VARCHAR(64) NOT NULL,
  guard_name VARCHAR(128) NOT NULL,
  badge_number VARCHAR(64) NOT NULL,
  shift_type VARCHAR(32) NOT NULL,
  shift_timing VARCHAR(64) NOT NULL,
  assigned_post VARCHAR(128) NOT NULL,
  effective_date VARCHAR(32) NOT NULL,
  status VARCHAR(32) DEFAULT 'ACTIVE_ON_DUTY',
  auto_duty_sync TINYINT(1) DEFAULT 1,
  assigned_by VARCHAR(128) DEFAULT 'Chief Security Officer',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (society_id) REFERENCES societies(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;

  dump += `CREATE TABLE drone_scheduled_patrols (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;

  dump += `CREATE TABLE drone_flight_logs (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;

  dump += `-- SEED DATA FOR PRODUCTION MYSQL DATABASE INSTANCE\n`;
  for (const s of societies) {
    dump += `INSERT INTO societies VALUES ('${s.id}', '${s.name}', '${s.subdomain}', '${s.custom_domain}', ${s.is_custom_domain_active}, '${s.registration_number}', '${s.gstin}', '${s.address}', '${s.city}', '${s.pincode}', ${s.total_flats}, ${s.total_blocks}, '${s.primary_color}', '${s.secondary_color}', '${s.logo_emblem}', '${s.admin_name}', '${s.admin_email}', '${s.admin_phone}', '${s.admin_role}', '${s.temporary_password}', '${s.ssl_status}', '${s.status}', NOW());\n`;
  }
  for (const r of residents) {
    dump += `INSERT INTO residents VALUES ('${r.id}', '${r.society_id}', '${r.unit}', '${r.block}', '${r.owner_name}', '${r.resident_type}', '${r.phone}', '${r.email}', '${r.parking_slot}', ${r.has_pets}, '${r.status}');\n`;
  }
  for (const inv of invoices) {
    dump += `INSERT INTO utility_invoices VALUES ('${inv.id}', '${inv.society_id}', '${inv.unit}', '${inv.resident_name}', '${inv.billing_period}', '${inv.due_date}', '${inv.status}', ${inv.society_maintenance_amount}, ${inv.electricity_dg_amount}, ${inv.water_utility_amount}, ${inv.total_amount}, ${inv.paid_at ? `'${inv.paid_at}'` : 'NULL'}, ${inv.payment_method ? `'${inv.payment_method}'` : 'NULL'}, ${inv.transaction_id ? `'${inv.transaction_id}'` : 'NULL'}, '${inv.receipt_hash}');\n`;
  }
  for (const d of deliveries) {
    dump += `INSERT INTO deliveries VALUES ('${d.id}', '${d.society_id}', '${d.unit}', '${d.carrier}', '${d.passcode}', '${d.status}', '${d.permission}', '${d.notes}', '${d.expected_window}', NOW(), NULL, NULL);\n`;
  }
  for (const v of visitors) {
    dump += `INSERT INTO premises_visitors VALUES ('${v.id}', '${v.society_id}', '${v.unit}', '${v.visitor_name}', '${v.visitor_phone}', '${v.visitor_type}', '${v.vehicle_number}', '${v.status}', '${v.entry_gate}', '${v.entry_time}', NULL);\n`;
  }
  for (const cp of checkpoints) {
    dump += `INSERT INTO guard_checkpoints VALUES ('${cp.id}', '${cp.society_id}', '${cp.name}', '${cp.location}', '${cp.qr_payload}', '${cp.nfc_tag_id}', ${cp.lat}, ${cp.lng}, ${cp.radius_meters}, '${cp.status}', '${cp.last_scanned_time}', '${cp.scanned_by}');\n`;
  }
  for (const t of tanks) {
    dump += `INSERT INTO water_tanks VALUES ('${t.id}', '${t.society_id}', '${t.name}', '${t.location}', ${t.capacity_litres}, ${t.current_litres}, ${t.level_percentage}, '${t.sensor_type}', '${t.sensor_health}', '${t.last_sensor_ping}', '${t.status}');\n`;
  }
  for (const p of pumps) {
    dump += `INSERT INTO water_pumps VALUES ('${p.id}', '${p.society_id}', '${p.name}', '${p.type}', '${p.source_tank_id}', '${p.target_tank_id}', '${p.state}', ${p.flow_rate_lpm}, ${p.power_kw}, ${p.voltage_v}, '${p.last_state_changed}');\n`;
  }
  for (const c of complaints) {
    dump += `INSERT INTO complaints VALUES ('${c.id}', '${c.society_id}', '${c.unit}', '${c.resident_name}', '${c.category}', '${c.title}', '${c.description}', '${c.priority}', '${c.status}', ${c.assigned_to ? `'${c.assigned_to}'` : 'NULL'}, ${c.resolution_notes ? `'${c.resolution_notes}'` : 'NULL'}, NOW(), ${c.resolved_at ? `'${c.resolved_at}'` : 'NULL'});\n`;
  }
  for (const n of notices) {
    dump += `INSERT INTO society_notices VALUES ('${n.id}', '${n.society_id}', '${n.title}', '${n.category}', '${n.content}', '${n.priority}', '${n.posted_by}', '${n.valid_until}', NOW());\n`;
  }
  for (const b of bookings) {
    dump += `INSERT INTO facility_bookings VALUES ('${b.id}', '${b.society_id}', '${b.unit}', '${b.resident_name}', '${b.facility_name}', '${b.booking_date}', '${b.time_slot}', '${b.status}', ${b.fee_amount}, NOW());\n`;
  }
  for (const st of staff) {
    dump += `INSERT INTO society_staff VALUES ('${st.id}', '${st.society_id}', '${st.name}', '${st.role}', '${st.phone}', '${st.email}', '${st.status}', '${st.shift}');\n`;
  }
  for (const iv of invites) {
    dump += `INSERT INTO visitor_invites VALUES ('${iv.id}', '${iv.society_id}', '${iv.unit}', '${iv.resident_name}', '${iv.resident_phone || ''}', '${iv.visitor_name}', '${iv.visitor_phone || ''}', '${iv.visitor_type || 'Guest'}', '${iv.company || ''}', '${iv.otp_code}', '${iv.vehicle_number || ''}', '${iv.valid_from || ''}', '${iv.valid_until || ''}', '${iv.status}', ${iv.admitted_at ? `'${iv.admitted_at}'` : 'NULL'}, ${iv.admitted_by_guard ? `'${iv.admitted_by_guard}'` : 'NULL'}, ${iv.entry_gate ? `'${iv.entry_gate}'` : 'NULL'}, NOW());\n`;
  }
  for (const al of alerts) {
    dump += `INSERT INTO security_alerts VALUES ('${al.id}', '${al.society_id}', '${al.guard_id}', '${al.guard_name}', '${al.alert_type}', '${al.severity}', '${al.location}', '${al.description}', '${al.intruder_details || ''}', '${al.status}', NOW(), NULL, NULL);\n`;
  }
  for (const gd of guards) {
    dump += `INSERT INTO guard_duty_profiles VALUES ('${gd.id}', '${gd.society_id}', '${gd.name}', '${gd.badge_number}', '${gd.phone || ''}', '${gd.assigned_gate}', ${gd.is_online}, '${gd.duty_shift}', '${gd.shift_started_at || ''}', ${gd.current_lat}, ${gd.current_lng}, ${gd.is_within_geofence}, ${gd.distance_from_post_meters}, NOW(), '${gd.master_photo_url || ''}', NOW(), '${gd.last_face_verified_at || ''}', ${gd.next_verification_due_minutes}, '${gd.face_verification_status}', ${gd.last_verification_confidence}, ${gd.battery_level});\n`;
  }
  for (const fl of faceLogs) {
    dump += `INSERT INTO guard_face_verification_logs VALUES ('${fl.id}', '${fl.society_id}', '${fl.guard_id}', '${fl.guard_name}', '${fl.captured_photo_url}', '${fl.master_photo_url}', ${fl.match_score}, '${fl.status}', '${fl.verification_notes}', NOW(), '${fl.operator_type}');\n`;
  }
  for (const sa of shiftAssignments) {
    dump += `INSERT INTO guard_shift_assignments VALUES ('${sa.id}', '${sa.society_id}', '${sa.guard_id}', '${sa.guard_name}', '${sa.badge_number}', '${sa.shift_type}', '${sa.shift_timing}', '${sa.assigned_post}', '${sa.effective_date}', '${sa.status}', ${sa.auto_duty_sync}, '${sa.assigned_by}', '${sa.notes || ''}', NOW());\n`;
  }
  for (const dp of dronePatrols) {
    dump += `INSERT INTO drone_scheduled_patrols VALUES ('${dp.id}', '${dp.society_id}', '${dp.patrol_name}', '${dp.patrol_time}', '${dp.frequency}', '${dp.flight_path}', '${dp.sensor_payload}', ${dp.altitude_m}, '${dp.status}', '${dp.last_run || ''}', '${dp.next_run}');\n`;
  }
  for (const dl of droneLogs) {
    dump += `INSERT INTO drone_flight_logs VALUES ('${dl.id}', '${dl.society_id}', '${dl.mission_id}', '${dl.mission_type}', '${dl.trigger_source}', '${dl.drone_callsign}', '${dl.drone_model}', '${dl.start_time}', '${dl.end_time || ''}', ${dl.duration_seconds}, '${dl.perimeter_zone}', ${dl.max_altitude_meters}, ${dl.avg_speed_kmh}, ${dl.battery_start_pct}, ${dl.battery_end_pct}, ${dl.threat_detected}, '${dl.threat_type || ''}', ${dl.thermal_signature_detected}, ${dl.max_heat_temp_celsius || 'NULL'}, '${dl.verification_status}', '${dl.gps_coordinates_path || ''}', '${dl.video_archive_url || ''}', '${dl.guard_alerted || ''}', ${dl.rwa_reviewed}, '${dl.rwa_remarks || ''}', NOW());\n`;
  }

  return dump;
}
