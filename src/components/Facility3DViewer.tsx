import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Compass, 
  Sparkles, 
  Maximize2, 
  Minimize2, 
  ShieldCheck, 
  Building2, 
  Droplet, 
  Radio, 
  Zap,
  Play,
  Pause,
  Sun,
  Moon
} from 'lucide-react';
import { PhotoCategory } from '../types/photos';

interface Facility3DViewerProps {
  category: PhotoCategory;
  className?: string;
  onFacilityAction?: (action: string) => void;
}

export const Facility3DViewer: React.FC<Facility3DViewerProps> = ({
  category,
  className = '',
  onFacilityAction
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [timePreset, setTimePreset] = useState<'twilight' | 'midnight' | 'sunset'>('twilight');
  const [activeActionState, setActiveActionState] = useState<string>('Normal');

  // Three.js internal references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const reqIdRef = useRef<number | null>(null);
  const objectsGroupRef = useRef<THREE.Group | null>(null);
  const isMouseDownRef = useRef<boolean>(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const timeRef = useRef<number>(0);
  const isRotatingRef = useRef<boolean>(true);

  // Sync isRotating state with ref
  useEffect(() => {
    isRotatingRef.current = isRotating;
  }, [isRotating]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Setup Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Background color based on preset
    const bgColors = {
      twilight: 0x081024,
      midnight: 0x030712,
      sunset: 0x1a0f24
    };
    scene.background = new THREE.Color(bgColors[timePreset]);
    scene.fog = new THREE.FogExp2(bgColors[timePreset], 0.012);

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 400;

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(24, 18, 30);
    camera.lookAt(0, 4, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(
      timePreset === 'twilight' ? 0x38bdf8 : timePreset === 'midnight' ? 0x1e1b4b : 0xf97316,
      1.4
    );
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffeedd, 2.0);
    mainLight.position.set(20, 35, 20);
    mainLight.castShadow = true;
    scene.add(mainLight);

    // Accent Cyber Point Lights
    const bluePoint = new THREE.PointLight(0x38bdf8, 3.5, 30);
    bluePoint.position.set(-10, 8, 10);
    scene.add(bluePoint);

    const amberPoint = new THREE.PointLight(0xfbbf24, 3.0, 30);
    amberPoint.position.set(10, 10, -5);
    scene.add(amberPoint);

    // 5. Construct 3D Model Group for the specific Category
    const group = new THREE.Group();
    objectsGroupRef.current = group;
    scene.add(group);

    // Common Podium Base with reflective dark slate
    const baseGeo = new THREE.BoxGeometry(36, 1, 36);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.3,
      metalness: 0.6
    });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = -0.5;
    base.receiveShadow = true;
    group.add(base);

    // Neon Grid Ring on Base
    const gridHelper = new THREE.GridHelper(36, 24, 0x38bdf8, 0x1e293b);
    gridHelper.position.y = 0.02;
    group.add(gridHelper);

    // Category Specific 3D Geometry
    switch (category) {
      case 'overview': {
        // --- 4 LUXURY HIGH-RISE TOWERS ---
        const towerConfigs = [
          { x: -7, z: -5, w: 6, h: 22, d: 6, color: 0x1e293b, glass: 0x38bdf8 },
          { x: 5, z: -6, w: 7, h: 26, d: 7, color: 0x0f172a, glass: 0x60a5fa },
          { x: -6, z: 6, w: 5.5, h: 18, d: 5.5, color: 0x1e293b, glass: 0x38bdf8 },
          { x: 6, z: 6, w: 6.5, h: 20, d: 6.5, color: 0x0f172a, glass: 0x93c5fd }
        ];

        towerConfigs.forEach((t) => {
          // Concrete Core
          const coreGeo = new THREE.BoxGeometry(t.w, t.h, t.d);
          const coreMat = new THREE.MeshStandardMaterial({ color: t.color, roughness: 0.5, metalness: 0.5 });
          const core = new THREE.Mesh(coreGeo, coreMat);
          core.position.set(t.x, t.h / 2, t.z);
          core.castShadow = true;
          core.receiveShadow = true;
          group.add(core);

          // Glowing Window Facades (Amber & Cyan)
          const floors = Math.floor(t.h / 2);
          for (let f = 1; f < floors; f++) {
            const glowGeo = new THREE.BoxGeometry(t.w + 0.15, 0.8, t.d + 0.15);
            const glowMat = new THREE.MeshBasicMaterial({
              color: f % 2 === 0 ? 0xfbbf24 : 0x38bdf8,
              transparent: true,
              opacity: 0.75
            });
            const band = new THREE.Mesh(glowGeo, glowMat);
            band.position.set(t.x, f * 2, t.z);
            group.add(band);
          }

          // Rooftop Antenna with Pulsing Beacon
          const antGeo = new THREE.CylinderGeometry(0.08, 0.15, 4, 8);
          const antMat = new THREE.MeshBasicMaterial({ color: 0xe2e8f0 });
          const ant = new THREE.Mesh(antGeo, antMat);
          ant.position.set(t.x, t.h + 2, t.z);
          group.add(ant);

          const tipGeo = new THREE.SphereGeometry(0.35, 8, 8);
          const tipMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
          const tip = new THREE.Mesh(tipGeo, tipMat);
          tip.position.set(t.x, t.h + 4, t.z);
          group.add(tip);
        });

        // Curving Highway with Animated Light Trail Particles
        const curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(-18, 0.2, 14),
          new THREE.Vector3(-6, 0.2, 16),
          new THREE.Vector3(8, 0.2, 14),
          new THREE.Vector3(18, 0.2, 8)
        ]);
        const tubeGeo = new THREE.TubeGeometry(curve, 32, 1.2, 8, false);
        const tubeMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
        const road = new THREE.Mesh(tubeGeo, tubeMat);
        group.add(road);
        break;
      }

      case 'security': {
        // --- SMART GEOFENCED GATEHOUSE & BARRIER ---
        // Guard Cabin
        const cabinGeo = new THREE.BoxGeometry(6, 4.5, 5);
        const cabinMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.2 });
        const cabin = new THREE.Mesh(cabinGeo, cabinMat);
        cabin.position.set(-6, 2.25, 0);
        cabin.castShadow = true;
        group.add(cabin);

        // Glass Front
        const glassGeo = new THREE.BoxGeometry(0.1, 3, 4);
        const glassMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.65, roughness: 0.1 });
        const glass = new THREE.Mesh(glassGeo, glassMat);
        glass.position.set(-2.9, 2.3, 0);
        group.add(glass);

        // Barrier Arm Post
        const postGeo = new THREE.BoxGeometry(1.2, 3, 1.2);
        const postMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b });
        const post = new THREE.Mesh(postGeo, postMat);
        post.position.set(-1.5, 1.5, -4);
        group.add(post);

        // Animated Boom Barrier Arm (Striped Red & White)
        const armGeo = new THREE.BoxGeometry(0.3, 0.4, 9);
        const armMat = new THREE.MeshStandardMaterial({ color: 0xef4444 });
        const arm = new THREE.Mesh(armGeo, armMat);
        arm.position.set(-1.5, 2.6, 0.5);
        arm.name = 'barrierArm';
        group.add(arm);

        // RFID & ALPR Camera Mast with Scanner Laser Ring
        const mastGeo = new THREE.CylinderGeometry(0.15, 0.2, 6, 8);
        const mastMat = new THREE.MeshStandardMaterial({ color: 0x64748b });
        const mast = new THREE.Mesh(mastGeo, mastMat);
        mast.position.set(5, 3, -3);
        group.add(mast);

        // Cyan Holographic Laser Scanner Grid
        const laserRingGeo = new THREE.TorusGeometry(3.5, 0.08, 8, 24);
        const laserRingMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
        const laserRing = new THREE.Mesh(laserRingGeo, laserRingMat);
        laserRing.rotation.x = Math.PI / 2;
        laserRing.position.set(2, 0.1, 0);
        group.add(laserRing);

        // Simulated Approaching Electric Vehicle
        const carGeo = new THREE.BoxGeometry(4, 2, 6);
        const carMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.9, roughness: 0.1 });
        const car = new THREE.Mesh(carGeo, carMat);
        car.position.set(2, 1.1, 7);
        car.castShadow = true;
        group.add(car);

        // Headlights (Glowing Beam Cones)
        [-1, 1].forEach((offset) => {
          const lightConeGeo = new THREE.ConeGeometry(1.2, 5, 16);
          const lightConeMat = new THREE.MeshBasicMaterial({
            color: 0xfef08a,
            transparent: true,
            opacity: 0.45,
            side: THREE.DoubleSide
          });
          const cone = new THREE.Mesh(lightConeGeo, lightConeMat);
          cone.rotation.x = -Math.PI / 2;
          cone.position.set(2 + offset * 1.2, 0.8, 3.5);
          group.add(cone);
        });
        break;
      }

      case 'pool': {
        // --- 50M RESORT INFINITY POOL DECK ---
        // Pool Basin Cavity
        const basinGeo = new THREE.BoxGeometry(22, 1.8, 14);
        const basinMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2 });
        const basin = new THREE.Mesh(basinGeo, basinMat);
        basin.position.set(0, 0.4, 0);
        group.add(basin);

        // Animated Water Surface Mesh
        const waterGeo = new THREE.PlaneGeometry(21.4, 13.4, 32, 32);
        const waterMat = new THREE.MeshStandardMaterial({
          color: 0x06b6d4,
          metalness: 0.2,
          roughness: 0.1,
          transparent: true,
          opacity: 0.85
        });
        const water = new THREE.Mesh(waterGeo, waterMat);
        water.rotation.x = -Math.PI / 2;
        water.position.set(0, 1.15, 0);
        water.name = 'waterMesh';
        group.add(water);

        // Underwater LED Lights
        for (let i = -8; i <= 8; i += 4) {
          const uLight = new THREE.PointLight(0x38bdf8, 2.5, 8);
          uLight.position.set(i, 0.6, 0);
          group.add(uLight);
        }

        // Surrounding Teak Sun Deck
        const deckGeo = new THREE.BoxGeometry(28, 0.6, 20);
        const deckMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7 });
        const deck = new THREE.Mesh(deckGeo, deckMat);
        deck.position.set(0, 0.2, 0);
        deck.receiveShadow = true;
        group.add(deck);

        // Sun Loungers
        [-8, -4, 0, 4, 8].forEach((lx) => {
          const loungerGeo = new THREE.BoxGeometry(1.6, 0.4, 3.2);
          const loungerMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
          const lounger = new THREE.Mesh(loungerGeo, loungerMat);
          lounger.position.set(lx, 0.8, -8);
          group.add(lounger);
        });
        break;
      }

      case 'water': {
        // --- 180,000L IOT ULTRASONIC SUMP & PUMP HOUSE ---
        // Transparent Underground Sump Reservoir
        const tankGeo = new THREE.BoxGeometry(16, 8, 12);
        const tankMat = new THREE.MeshStandardMaterial({
          color: 0x1e293b,
          roughness: 0.3,
          metalness: 0.8,
          wireframe: false
        });
        const tank = new THREE.Mesh(tankGeo, tankMat);
        tank.position.set(-4, 4, 0);
        group.add(tank);

        // Live Water Liquid Mesh
        const waterGeo = new THREE.BoxGeometry(15.6, 6.2, 11.6);
        const waterMat = new THREE.MeshStandardMaterial({
          color: 0x0284c7,
          roughness: 0.1,
          transparent: true,
          opacity: 0.8
        });
        const water = new THREE.Mesh(waterGeo, waterMat);
        water.position.set(-4, 3.2, 0);
        water.name = 'tankWaterMesh';
        group.add(water);

        // Ultrasonic Radar Mast on Top
        const sensorGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.5, 16);
        const sensorMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
        const sensor = new THREE.Mesh(sensorGeo, sensorMat);
        sensor.position.set(-4, 8.8, 0);
        group.add(sensor);

        // Pulsing Sonar Ring
        const ringGeo = new THREE.RingGeometry(0.8, 1.2, 16);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.set(-4, 9.6, 0);
        group.add(ring);

        // Heavy Commercial Variable Frequency Pumps (VFD 1 & 2)
        [6, 11].forEach((pz, idx) => {
          const pumpGeo = new THREE.CylinderGeometry(1.6, 1.8, 5, 16);
          const pumpMat = new THREE.MeshStandardMaterial({ color: idx === 0 ? 0x059669 : 0x2563eb, metalness: 0.9, roughness: 0.2 });
          const pump = new THREE.Mesh(pumpGeo, pumpMat);
          pump.position.set(7, 2.5, pz - 8);
          group.add(pump);

          // Digital Flow Meter LED Display
          const ledGeo = new THREE.BoxGeometry(0.8, 0.6, 0.2);
          const ledMat = new THREE.MeshBasicMaterial({ color: 0x34d399 });
          const led = new THREE.Mesh(ledGeo, ledMat);
          led.position.set(7, 3.5, pz - 6.8);
          group.add(led);
        });

        // High-Pressure Blue Delivery Pipes
        const pipeCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(-4, 4, 0),
          new THREE.Vector3(2, 4, 0),
          new THREE.Vector3(7, 2, 0),
          new THREE.Vector3(7, 9, 0),
          new THREE.Vector3(14, 9, 0)
        ]);
        const pipeGeo = new THREE.TubeGeometry(pipeCurve, 20, 0.4, 8, false);
        const pipeMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.8, roughness: 0.2 });
        const pipe = new THREE.Mesh(pipeGeo, pipeMat);
        group.add(pipe);
        break;
      }

      case 'parking': {
        // --- SUB-BASEMENT COVERED PARKING & SMART EV HUB ---
        // Concrete Ceiling Slab
        const ceilingGeo = new THREE.BoxGeometry(26, 0.8, 20);
        const ceilingMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 });
        const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);
        ceiling.position.set(0, 6, 0);
        group.add(ceiling);

        // Structural Support Pillars
        [[-8, -6], [-8, 6], [8, -6], [8, 6]].forEach(([px, pz]) => {
          const colGeo = new THREE.BoxGeometry(1.4, 6, 1.4);
          const colMat = new THREE.MeshStandardMaterial({ color: 0x334155 });
          const col = new THREE.Mesh(colGeo, colMat);
          col.position.set(px, 3, pz);
          group.add(col);
        });

        // 3D EV Fast Chargers with Glowing Neon Stems
        [-6, 0, 6].forEach((cx) => {
          const chargerGeo = new THREE.BoxGeometry(0.8, 3.2, 0.8);
          const chargerMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });
          const charger = new THREE.Mesh(chargerGeo, chargerMat);
          charger.position.set(cx, 1.6, -8);
          group.add(charger);

          // Glowing Green Status Ring
          const ringGeo = new THREE.TorusGeometry(0.4, 0.08, 8, 16);
          const ringMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
          const ring = new THREE.Mesh(ringGeo, ringMat);
          ring.position.set(cx, 2.5, -7.5);
          group.add(ring);
        });

        // Overhead Green/Red Ultrasonic Slot Sensor LEDs
        [-6, 0, 6].forEach((sx, idx) => {
          const slotLedGeo = new THREE.SphereGeometry(0.2, 8, 8);
          const slotLedMat = new THREE.MeshBasicMaterial({ color: idx === 1 ? 0xef4444 : 0x10b981 });
          const slotLed = new THREE.Mesh(slotLedGeo, slotLedMat);
          slotLed.position.set(sx, 5.5, -4);
          group.add(slotLed);
        });
        break;
      }

      case 'drone': {
        // --- AUTONOMOUS DRONE AERIAL SURVEILLANCE & PERIMETER BLINDSPOTS ---
        // 1. Boundary Wall & Concrete Piers
        const wallGeo = new THREE.BoxGeometry(28, 4, 0.8);
        const wallMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8, metalness: 0.2 });
        const wall = new THREE.Mesh(wallGeo, wallMat);
        wall.position.set(0, 2, -9);
        wall.castShadow = true;
        group.add(wall);

        // Barbed wire & glowing laser tripwire beam running along wall
        const laserTripwireGeo = new THREE.CylinderGeometry(0.04, 0.04, 28, 8);
        const laserTripwireMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
        const laserTripwire = new THREE.Mesh(laserTripwireGeo, laserTripwireMat);
        laserTripwire.rotation.z = Math.PI / 2;
        laserTripwire.position.set(0, 4.3, -9);
        group.add(laserTripwire);

        // Security Wall Posts with glowing sensor caps
        [-13, -7, 0, 7, 13].forEach((px) => {
          const postGeo = new THREE.BoxGeometry(1.2, 5, 1.2);
          const postMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });
          const post = new THREE.Mesh(postGeo, postMat);
          post.position.set(px, 2.5, -9);
          group.add(post);

          const capGeo = new THREE.SphereGeometry(0.25, 8, 8);
          const capMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
          const cap = new THREE.Mesh(capGeo, capMat);
          cap.position.set(px, 5.2, -9);
          group.add(cap);
        });

        // 2. Fixed Ground CCTV Mast with Blindspot Warning Cone
        const cctvMastGeo = new THREE.CylinderGeometry(0.18, 0.22, 7, 8);
        const cctvMastMat = new THREE.MeshStandardMaterial({ color: 0x64748b });
        const cctvMast = new THREE.Mesh(cctvMastGeo, cctvMastMat);
        cctvMast.position.set(-10, 3.5, -6);
        group.add(cctvMast);

        const cctvHeadGeo = new THREE.BoxGeometry(0.6, 0.5, 1.2);
        const cctvHeadMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });
        const cctvHead = new THREE.Mesh(cctvHeadGeo, cctvHeadMat);
        cctvHead.position.set(-10, 7, -6);
        cctvHead.rotation.x = 0.3;
        group.add(cctvHead);

        // Red translucent Ground Blindspot Cone (Zone hidden from fixed ground camera)
        const blindspotGeo = new THREE.CylinderGeometry(0.2, 4.5, 6, 16);
        const blindspotMat = new THREE.MeshBasicMaterial({
          color: 0xef4444,
          transparent: true,
          opacity: 0.18,
          wireframe: true
        });
        const blindspot = new THREE.Mesh(blindspotGeo, blindspotMat);
        blindspot.position.set(-5, 2.8, -4);
        group.add(blindspot);

        // 3. Dense Landscaping Shrubbery with Hidden Thermal Heat Target (Human intruder)
        [-4, -2, 2, 4, 8].forEach((bx, idx) => {
          const bushGeo = new THREE.DodecahedronGeometry(1.4 + (idx % 3) * 0.3);
          const bushMat = new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.9 });
          const bush = new THREE.Mesh(bushGeo, bushMat);
          bush.position.set(bx, 1.2, -7.2 + (idx % 2));
          bush.castShadow = true;
          group.add(bush);
        });

        // FLIR Thermal Intruder Heat Signature inside bushes (Pulsing glowing target)
        const thermalTargetGeo = new THREE.SphereGeometry(0.85, 16, 16);
        const thermalTargetMat = new THREE.MeshBasicMaterial({
          color: 0xf97316, // Orange/red FLIR body heat
          transparent: true,
          opacity: 0.9
        });
        const thermalTarget = new THREE.Mesh(thermalTargetGeo, thermalTargetMat);
        thermalTarget.position.set(2.5, 1.0, -6.8);
        thermalTarget.name = 'thermalTarget';
        group.add(thermalTarget);

        // Heat pulse ring
        const heatRingGeo = new THREE.RingGeometry(0.9, 1.8, 16);
        const heatRingMat = new THREE.MeshBasicMaterial({ color: 0xef4444, side: THREE.DoubleSide, transparent: true, opacity: 0.45 });
        const heatRing = new THREE.Mesh(heatRingGeo, heatRingMat);
        heatRing.rotation.x = Math.PI / 2;
        heatRing.position.set(2.5, 0.15, -6.8);
        group.add(heatRing);

        // 4. Elevated Terrace Corner with Autonomous Drone Helipad Docking Nest
        const terraceGeo = new THREE.BoxGeometry(10, 8, 10);
        const terraceMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.6 });
        const terrace = new THREE.Mesh(terraceGeo, terraceMat);
        terrace.position.set(-8, 4, 5);
        terrace.castShadow = true;
        group.add(terrace);

        // Helipad Circle & "H" Marking
        const helipadGeo = new THREE.CylinderGeometry(3.6, 3.6, 0.2, 32);
        const helipadMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8 });
        const helipad = new THREE.Mesh(helipadGeo, helipadMat);
        helipad.position.set(-8, 8.1, 5);
        group.add(helipad);

        // Blue perimeter beacon ring on Helipad
        const beaconRingGeo = new THREE.TorusGeometry(3.2, 0.08, 8, 32);
        const beaconRingMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
        const beaconRing = new THREE.Mesh(beaconRingGeo, beaconRingMat);
        beaconRing.rotation.x = Math.PI / 2;
        beaconRing.position.set(-8, 8.25, 5);
        group.add(beaconRing);

        // 5. Autonomous Surveillance Quadcopter Drone
        const drone = new THREE.Group();
        drone.name = 'droneGroup';
        drone.position.set(1, 9, -2);

        // Drone Central Fuselage (Carbon Matte Chassis)
        const bodyGeo = new THREE.BoxGeometry(2.2, 0.6, 2.2);
        const bodyMat = new THREE.MeshStandardMaterial({ color: 0x020617, metalness: 0.9, roughness: 0.2 });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        drone.add(body);

        // Drone Top Dome with GPS puck & Status LED
        const domePuckGeo = new THREE.CylinderGeometry(0.5, 0.6, 0.4, 16);
        const domePuckMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });
        const domePuck = new THREE.Mesh(domePuckGeo, domePuckMat);
        domePuck.position.y = 0.4;
        drone.add(domePuck);

        const statusLedGeo = new THREE.SphereGeometry(0.18, 8, 8);
        const statusLedMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
        const statusLed = new THREE.Mesh(statusLedGeo, statusLedMat);
        statusLed.position.set(0, 0.65, 0);
        drone.add(statusLed);

        // 4 Quadcopter Arms (Carbon fiber rods extending diagonally)
        const armLength = 2.4;
        const armOffsets = [
          { x: 1, z: 1, name: 'rotor1' },
          { x: -1, z: 1, name: 'rotor2' },
          { x: 1, z: -1, name: 'rotor3' },
          { x: -1, z: -1, name: 'rotor4' }
        ];

        armOffsets.forEach((ao) => {
          // Motor arm strut
          const armGeo = new THREE.CylinderGeometry(0.08, 0.08, armLength, 8);
          const armMat = new THREE.MeshStandardMaterial({ color: 0x475569 });
          const armMesh = new THREE.Mesh(armGeo, armMat);
          armMesh.position.set(ao.x * 1.1, 0, ao.z * 1.1);
          armMesh.rotation.z = ao.x * 0.7;
          armMesh.rotation.x = ao.z * 0.7;
          drone.add(armMesh);

          // Motor pod
          const motorGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.5, 12);
          const motorMat = new THREE.MeshStandardMaterial({ color: 0x0284c7 });
          const motor = new THREE.Mesh(motorGeo, motorMat);
          motor.position.set(ao.x * 1.9, 0.2, ao.z * 1.9);
          drone.add(motor);

          // Spinning Rotor Propeller Disc (Translucent with motion blur)
          const rotorGeo = new THREE.CylinderGeometry(1.1, 1.1, 0.02, 16);
          const rotorMat = new THREE.MeshBasicMaterial({
            color: 0x38bdf8,
            transparent: true,
            opacity: 0.55
          });
          const rotor = new THREE.Mesh(rotorGeo, rotorMat);
          rotor.position.set(ao.x * 1.9, 0.45, ao.z * 1.9);
          rotor.name = ao.name;
          drone.add(rotor);
        });

        // 4K Optical & FLIR Thermal Gimbal Camera Underbelly
        const gimbalGeo = new THREE.SphereGeometry(0.45, 16, 16);
        const gimbalMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1 });
        const gimbal = new THREE.Mesh(gimbalGeo, gimbalMat);
        gimbal.position.set(0, -0.4, 0.6);
        drone.add(gimbal);

        const lensGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.2, 12);
        const lensMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b }); // Amber FLIR sensor
        const lens = new THREE.Mesh(lensGeo, lensMat);
        lens.rotation.x = Math.PI / 2;
        lens.position.set(0, -0.4, 0.8);
        drone.add(lens);

        // Volumetric Downward Searchlight / Spotlight Cone
        const searchConeGeo = new THREE.ConeGeometry(3.8, 9, 16, 1, true);
        const searchConeMat = new THREE.MeshBasicMaterial({
          color: 0x38bdf8,
          transparent: true,
          opacity: 0.25,
          side: THREE.DoubleSide
        });
        const searchCone = new THREE.Mesh(searchConeGeo, searchConeMat);
        searchCone.position.set(0, -4.5, 0.6);
        searchCone.name = 'droneSearchCone';
        drone.add(searchCone);

        group.add(drone);

        // 6. Dotted Flight Waypoint Trajectory Line
        const pathCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(-8, 9, 5),
          new THREE.Vector3(-4, 10, 0),
          new THREE.Vector3(1, 9, -2),
          new THREE.Vector3(6, 8.5, -6),
          new THREE.Vector3(-2, 9.2, -8),
          new THREE.Vector3(-8, 9, 5)
        ]);
        const pathPoints = pathCurve.getPoints(40);
        const pathGeo = new THREE.BufferGeometry().setFromPoints(pathPoints);
        const pathMat = new THREE.LineDashedMaterial({ color: 0x06b6d4, dashSize: 0.8, gapSize: 0.4 });
        const flightPathLine = new THREE.Line(pathGeo, pathMat);
        flightPathLine.computeLineDistances();
        group.add(flightPathLine);

        break;
      }

      default: {
        // Generic Futuristic Geometric Amenity Model
        const domeGeo = new THREE.SphereGeometry(8, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
        const domeMat = new THREE.MeshStandardMaterial({
          color: 0x38bdf8,
          metalness: 0.9,
          roughness: 0.1,
          transparent: true,
          opacity: 0.75,
          wireframe: true
        });
        const dome = new THREE.Mesh(domeGeo, domeMat);
        dome.position.set(0, 0, 0);
        group.add(dome);

        // Central Core
        const coreGeo = new THREE.CylinderGeometry(3, 4, 6, 16);
        const coreMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 });
        const core = new THREE.Mesh(coreGeo, coreMat);
        core.position.set(0, 3, 0);
        group.add(core);
        break;
      }
    }

    // 6. Animation Loop
    let barrierAngle = 0;
    let barrierDir = 1;

    const animate = () => {
      reqIdRef.current = requestAnimationFrame(animate);
      timeRef.current += 0.02;

      // Auto rotation
      if (isRotatingRef.current && objectsGroupRef.current) {
        objectsGroupRef.current.rotation.y += 0.005;
      }

      // Animate Water Ripple if pool
      const waterMesh = group.getObjectByName('waterMesh') as THREE.Mesh;
      if (waterMesh && waterMesh.geometry) {
        const pos = waterMesh.geometry.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          const u = pos.getX(i);
          const v = pos.getY(i);
          pos.setZ(i, Math.sin(u * 0.8 + timeRef.current * 2) * 0.12 + Math.cos(v * 0.8 + timeRef.current * 1.5) * 0.12);
        }
        pos.needsUpdate = true;
      }

      // Animate Sump Water Level
      const tankWater = group.getObjectByName('tankWaterMesh') as THREE.Mesh;
      if (tankWater) {
        tankWater.scale.y = 1 + Math.sin(timeRef.current * 0.5) * 0.05;
      }

      // Animate Boom Barrier if security
      const barrier = group.getObjectByName('barrierArm') as THREE.Mesh;
      if (barrier) {
        barrierAngle += 0.015 * barrierDir;
        if (barrierAngle > 1.2) barrierDir = -1;
        if (barrierAngle < 0) barrierDir = 1;
        barrier.rotation.x = barrierAngle;
      }

      // Animate Autonomous Drone Quadcopter & Rotors
      const droneGroup = group.getObjectByName('droneGroup') as THREE.Group;
      if (droneGroup) {
        droneGroup.position.y = 8.5 + Math.sin(timeRef.current * 1.6) * 0.45;
        droneGroup.position.x = 1 + Math.sin(timeRef.current * 0.5) * 3.2;
        droneGroup.position.z = -2 + Math.cos(timeRef.current * 0.5) * 2.0;
        droneGroup.rotation.z = Math.cos(timeRef.current * 0.5) * -0.09;
        droneGroup.rotation.x = Math.sin(timeRef.current * 1.6) * 0.06;

        ['rotor1', 'rotor2', 'rotor3', 'rotor4'].forEach((rName, idx) => {
          const rotor = droneGroup.getObjectByName(rName) as THREE.Mesh;
          if (rotor) {
            rotor.rotation.y += (idx % 2 === 0 ? 0.7 : -0.7);
          }
        });
      }

      // Animate Thermal Target Heat Signature pulse in shrubbery
      const thermalTarget = group.getObjectByName('thermalTarget') as THREE.Mesh;
      if (thermalTarget) {
        const pulse = 1 + Math.sin(timeRef.current * 3.5) * 0.18;
        thermalTarget.scale.set(pulse, pulse, pulse);
      }

      renderer.render(scene, camera);
    };

    animate();

    // 7. Mouse Orbit Drag Controls
    const onMouseDown = (e: MouseEvent) => {
      isMouseDownRef.current = true;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isMouseDownRef.current || !objectsGroupRef.current) return;
      const dx = e.clientX - prevMouseRef.current.x;
      const dy = e.clientY - prevMouseRef.current.y;
      objectsGroupRef.current.rotation.y += dx * 0.008;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isMouseDownRef.current = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [category, timePreset]);

  const handleZoom = (inOut: 'in' | 'out') => {
    if (!cameraRef.current) return;
    const factor = inOut === 'in' ? 0.85 : 1.15;
    cameraRef.current.position.multiplyScalar(factor);
  };

  const handleTriggerAction = () => {
    if (category === 'security') {
      setActiveActionState('Barrier Cycling (ALPR Authenticated)');
      if (onFacilityAction) onFacilityAction('Barrier Open/Close');
    } else if (category === 'drone') {
      setActiveActionState('12,000lm Strobe Deterrent & FLIR Lock Active');
      if (onFacilityAction) onFacilityAction('Drone Strobe Deterrent');
    } else if (category === 'water') {
      setActiveActionState('Submersible Pump Relay Engaged');
      if (onFacilityAction) onFacilityAction('Water Pump Transfer');
    } else {
      setActiveActionState('IoT Sensor Telemetry Synced');
      if (onFacilityAction) onFacilityAction('Sync Telemetry');
    }
    setTimeout(() => setActiveActionState('Normal'), 3500);
  };

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-950 shadow-2xl group select-none ${className}`}>
      {/* Interactive Canvas Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Floating HUD Controls */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="px-2.5 py-1 rounded-xl bg-slate-900/90 border border-slate-700 backdrop-blur-md flex items-center gap-1.5 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-[11px] font-mono font-bold text-cyan-300 uppercase tracking-wider">
              Interactive Digital Twin
            </span>
          </div>

          {activeActionState !== 'Normal' && (
            <div className="px-2.5 py-1 rounded-xl bg-emerald-950/90 border border-emerald-500/80 text-emerald-300 text-[10px] font-mono font-bold animate-pulse">
              ⚡ {activeActionState}
            </div>
          )}
        </div>

        {/* Lighting & Rotation Presets */}
        <div className="flex items-center gap-1.5 pointer-events-auto bg-slate-900/90 border border-slate-700 p-1 rounded-xl backdrop-blur-md">
          <button
            onClick={() => setTimePreset(timePreset === 'twilight' ? 'midnight' : 'twilight')}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Toggle Twilight / Night"
          >
            {timePreset === 'twilight' ? <Moon className="w-3.5 h-3.5 text-cyan-400" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
          </button>

          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isRotating ? 'text-cyan-400 bg-cyan-950/60' : 'text-slate-400 hover:text-white'
            }`}
            title="Toggle 3D Auto-Rotation"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
          </button>

          <button
            onClick={() => handleZoom('in')}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => handleZoom('out')}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom Floating Interactive Action Bar */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        <span className="text-[10px] font-mono text-slate-400 bg-slate-900/80 px-2 py-1 rounded-md border border-slate-800 hidden sm:inline-block">
          🖱️ Click & drag to rotate 3D model
        </span>

        <button
          onClick={handleTriggerAction}
          className="pointer-events-auto px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ml-auto"
        >
          <Zap className="w-3.5 h-3.5 text-yellow-300" />
          <span>
            {category === 'security'
              ? 'Test Barrier Sensor'
              : category === 'drone'
              ? 'Engage Strobe & FLIR Lock'
              : category === 'water'
              ? 'Trigger Pump Relay'
              : category === 'parking'
              ? 'Simulate EV Fast-Charge'
              : 'Interact with 3D Model'}
          </span>
        </button>
      </div>
    </div>
  );
};
