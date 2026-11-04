import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Compass, 
  Sun, 
  Moon, 
  Sparkles, 
  Maximize2, 
  Minimize2, 
  ShieldCheck, 
  Building2, 
  Droplet, 
  Radio, 
  Layers
} from 'lucide-react';

interface SmartSociety3DSceneProps {
  className?: string;
  onSelectBuilding?: (name: string) => void;
}

export const SmartSociety3DScene: React.FC<SmartSociety3DSceneProps> = ({
  className = '',
  onSelectBuilding
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTheme, setActiveTheme] = useState<'twilight' | 'cyber' | 'sunset'>('twilight');
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [hoveredObject, setHoveredObject] = useState<{
    name: string;
    type: string;
    details: string;
    status: string;
    x: number;
    y: number;
  } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // References to update Three.js scene dynamically
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const isInteractingRef = useRef<boolean>(false);
  const mousePosRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const timeRef = useRef<number>(0);
  const autoRotateRef = useRef<boolean>(true);

  // Sync auto rotate state with ref
  useEffect(() => {
    autoRotateRef.current = isAutoRotating;
  }, [isAutoRotating]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Background themes (Twilight, Cyber, Sunset)
    const getThemeColors = (theme: 'twilight' | 'cyber' | 'sunset') => {
      switch (theme) {
        case 'twilight':
          return {
            bg: 0x081024,
            fog: 0x0c1b33,
            ambient: 0x435b80,
            road: 0x141824,
            tower1: 0x1e293b,
            tower2: 0x0f172a,
            glassGlow: 0xf59e0b, // Warm amber window glow
            lightTrail1: 0xfffbeb, // White/gold headlights
            lightTrail2: 0xf43f5e, // Red taillights
            neonAccent: 0x38bdf8
          };
        case 'cyber':
          return {
            bg: 0x030712,
            fog: 0x050e20,
            ambient: 0x1e3a8a,
            road: 0x090d16,
            tower1: 0x0a1628,
            tower2: 0x030d1a,
            glassGlow: 0x38bdf8,
            lightTrail1: 0x06b6d4,
            lightTrail2: 0x10b981,
            neonAccent: 0x10b981
          };
        case 'sunset':
          return {
            bg: 0x1f1224,
            fog: 0x2a1730,
            ambient: 0x7c2d12,
            road: 0x1c1917,
            tower1: 0x292524,
            tower2: 0x1c1917,
            glassGlow: 0xfbbf24,
            lightTrail1: 0xfef08a,
            lightTrail2: 0xe11d48,
            neonAccent: 0xf97316
          };
      }
    };

    const colors = getThemeColors(activeTheme);
    scene.background = new THREE.Color(colors.bg);
    scene.fog = new THREE.FogExp2(colors.fog, 0.007);

    // 2. Camera Setup (high-angle elevated perspective overlooking the illuminated skyline and curved highway)
    const width = container.clientWidth;
    const height = container.clientHeight;
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(45, 32, 55);
    camera.lookAt(0, 8, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(colors.ambient, 1.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffeedd, 2.2);
    dirLight.position.set(30, 60, 40);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    // Street Lamps / Architectural Point Lights
    const warmPoint1 = new THREE.PointLight(0xfbbf24, 3.5, 40, 1.5);
    warmPoint1.position.set(0, 12, 10);
    scene.add(warmPoint1);

    const cyanPoint2 = new THREE.PointLight(colors.neonAccent, 4.0, 50, 1.5);
    cyanPoint2.position.set(-15, 18, -5);
    scene.add(cyanPoint2);

    // 5. Ground / Landscaped Podium Base
    const groundGeo = new THREE.PlaneGeometry(240, 240);
    const groundMat = new THREE.MeshStandardMaterial({
      color: colors.road,
      roughness: 0.6,
      metalness: 0.3
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.05;
    ground.receiveShadow = true;
    scene.add(ground);

    // Grid Floor Overlay
    const gridHelper = new THREE.GridHelper(200, 50, colors.neonAccent, 0x1e293b);
    gridHelper.position.y = 0.02;
    scene.add(gridHelper);

    // 6. Interactive Building Meshes Group
    const buildingsGroup = new THREE.Group();
    scene.add(buildingsGroup);

    // Helper: Window texture generator for realistic night skyscraper windows
    const createWindowTexture = (glowColorHex: string) => {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#0a0f1d';
        ctx.fillRect(0, 0, 128, 256);

        // Draw illuminated window grid
        const rows = 32;
        const cols = 8;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            // Randomly turn on/off window lights
            if (Math.random() > 0.35) {
              const warm = Math.random() > 0.4;
              ctx.fillStyle = warm ? glowColorHex : '#ffffff';
              ctx.globalAlpha = 0.6 + Math.random() * 0.4;
              ctx.fillRect(c * 16 + 3, r * 8 + 2, 10, 4);
            }
          }
        }
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      return tex;
    };

    const windowTexture = createWindowTexture('#fbbf24');

    // Building definitions (Luxury High-Rises, Gatehouse, Clubhouse)
    const buildingsData = [
      {
        id: 'tower_a',
        name: 'Tower A · Skyview Residency',
        type: 'Residential Skyrise',
        details: '14 Floors · 140 Luxury 3BHK Units · Biometric Lifts',
        status: 'Online · 99.8% Occupied',
        x: -12,
        z: -6,
        w: 9,
        d: 9,
        h: 34,
        color: colors.tower1,
        floors: 14
      },
      {
        id: 'tower_b',
        name: 'Tower B · Sky Suites',
        type: 'Residential High-Rise',
        details: '16 Floors · 160 Units · Rooftop Heli-pad & Solar',
        status: 'Online · Smart IoT Enabled',
        x: 10,
        z: -14,
        w: 10,
        d: 10,
        h: 40,
        color: colors.tower2,
        floors: 16
      },
      {
        id: 'tower_c',
        name: 'Tower C · Executive Block',
        type: 'Condominium Towers',
        details: '12 Floors · 120 Units · Dual DG Backup Bay',
        status: 'Online · Sensor Monitored',
        x: -24,
        z: -20,
        w: 8,
        d: 8,
        h: 28,
        color: colors.tower1,
        floors: 12
      },
      {
        id: 'clubhouse',
        name: 'The Pavilion · Clubhouse & Pool',
        type: 'Smart Community Hub',
        details: '50m Infinity Pool Deck · Gym · Banquet Hall',
        status: 'Active · Open 06:00 - 22:00',
        x: 0,
        z: 4,
        w: 14,
        d: 10,
        h: 8,
        color: 0x1e3a8a,
        floors: 2
      },
      {
        id: 'gatehouse',
        name: 'Gate 01 Main Security Barrier',
        type: 'Access Control Gateway',
        details: 'ALPR Cameras · RFID Boom Barrier · Geofence Radar',
        status: 'Active Guard On Duty',
        x: 0,
        z: 24,
        w: 12,
        d: 6,
        h: 5,
        color: 0x2563eb,
        floors: 1
      },
      {
        id: 'water_iot',
        name: 'IoT Water Management Plant',
        type: 'Utility Infrastructure',
        details: '120,000L Sump · Dual Borewell Auto-Cutoff Relays',
        status: 'Pumps Normal · 84% Level',
        x: 22,
        z: 8,
        w: 7,
        d: 7,
        h: 6,
        color: 0x0891b2,
        floors: 1
      },
      // Background skyline silhouettes for depth (like Atlanta / Singapore in user image)
      { id: 'bg_1', name: 'Metro Commercial Plaza', type: 'Skyline Cityscape', details: 'Urban District', status: 'Background', x: -35, z: -45, w: 12, d: 12, h: 52, color: 0x0b1329, floors: 24 },
      { id: 'bg_2', name: 'Smart Central Tower', type: 'Skyline Cityscape', details: 'Urban District', status: 'Background', x: 28, z: -48, w: 14, d: 14, h: 58, color: 0x080f21, floors: 26 },
      { id: 'bg_3', name: 'Horizon Spire', type: 'Skyline Cityscape', details: 'Urban District', status: 'Background', x: -5, z: -55, w: 9, d: 9, h: 64, color: 0x091428, floors: 30 },
    ];

    const clickableMeshes: THREE.Mesh[] = [];

    buildingsData.forEach((b) => {
      // Main Building Geometry
      const boxGeo = new THREE.BoxGeometry(b.w, b.h, b.d);
      const isForeground = !b.id.startsWith('bg_');

      // Material with window glow maps
      const boxMat = new THREE.MeshStandardMaterial({
        color: b.color,
        roughness: 0.35,
        metalness: 0.7,
        map: isForeground ? windowTexture : null,
        bumpScale: 0.05
      });

      const mesh = new THREE.Mesh(boxGeo, boxMat);
      mesh.position.set(b.x, b.h / 2, b.z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = b;
      buildingsGroup.add(mesh);

      if (isForeground) {
        clickableMeshes.push(mesh);

        // Glowing Wireframe Edges on Tower Roof & Corners
        const edges = new THREE.EdgesGeometry(boxGeo);
        const lineMat = new THREE.LineBasicMaterial({
          color: colors.neonAccent,
          transparent: true,
          opacity: 0.4
        });
        const wireframe = new THREE.LineSegments(edges, lineMat);
        mesh.add(wireframe);

        // Rooftop Spire / Antenna on high-rises
        if (b.h > 15) {
          const spireGeo = new THREE.CylinderGeometry(0.1, 0.4, 6, 8);
          const spireMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
          const spire = new THREE.Mesh(spireGeo, spireMat);
          spire.position.set(0, b.h / 2 + 3, 0);
          mesh.add(spire);

          // Blinking aviation red safety light
          const beaconGeo = new THREE.SphereGeometry(0.35, 8, 8);
          const beaconMat = new THREE.MeshBasicMaterial({ color: 0xff2222 });
          const beacon = new THREE.Mesh(beaconGeo, beaconMat);
          beacon.position.set(0, b.h / 2 + 6, 0);
          mesh.add(beacon);
        }

        // Floating 3D Hotspot Beacon above building
        const beaconRingGeo = new THREE.RingGeometry(1.2, 1.8, 16);
        const beaconRingMat = new THREE.MeshBasicMaterial({
          color: colors.neonAccent,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.8
        });
        const beaconRing = new THREE.Mesh(beaconRingGeo, beaconRingMat);
        beaconRing.rotation.x = Math.PI / 2;
        beaconRing.position.set(0, b.h / 2 + 1.5, 0);
        mesh.add(beaconRing);
      }
    });

    // 7. Curved Highway & Streaming Traffic Light Trails (mimicking the iconic highway in aa.webp!)
    // We create curved multi-lane paths with animated particle light streams
    const createCurvedHighway = () => {
      // Highway asphalt curve
      const highwayCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-45, 0.2, 38),
        new THREE.Vector3(-25, 0.25, 34),
        new THREE.Vector3(0, 0.3, 26),
        new THREE.Vector3(25, 0.35, 20),
        new THREE.Vector3(48, 0.4, 12),
        new THREE.Vector3(65, 0.45, 2)
      ]);

      const highwayTubeGeo = new THREE.TubeGeometry(highwayCurve, 64, 3.2, 8, false);
      const highwayMat = new THREE.MeshStandardMaterial({
        color: 0x182030,
        roughness: 0.5,
        metalness: 0.4
      });
      const highwayMesh = new THREE.Mesh(highwayTubeGeo, highwayMat);
      highwayMesh.scale.set(1, 0.08, 1); // Flatten into a ribbon road
      scene.add(highwayMesh);

      // Light Trail 1: Golden/White Headlight Streaks (South to North)
      const trail1Count = 180;
      const trail1Geo = new THREE.BufferGeometry();
      const trail1Positions = new Float32Array(trail1Count * 3);
      const trail1Colors = new Float32Array(trail1Count * 3);

      const colorWhite = new THREE.Color(colors.lightTrail1);
      const colorAmber = new THREE.Color(0xfbbf24);

      for (let i = 0; i < trail1Count; i++) {
        const t = (i / trail1Count);
        const pt = highwayCurve.getPoint(t);
        // Offset for lane
        trail1Positions[i * 3] = pt.x - 0.8 + (Math.random() - 0.5) * 0.4;
        trail1Positions[i * 3 + 1] = pt.y + 0.35;
        trail1Positions[i * 3 + 2] = pt.z - 0.8 + (Math.random() - 0.5) * 0.4;

        const c = Math.random() > 0.3 ? colorWhite : colorAmber;
        trail1Colors[i * 3] = c.r;
        trail1Colors[i * 3 + 1] = c.g;
        trail1Colors[i * 3 + 2] = c.b;
      }

      trail1Geo.setAttribute('position', new THREE.BufferAttribute(trail1Positions, 3));
      trail1Geo.setAttribute('color', new THREE.BufferAttribute(trail1Colors, 3));

      const trail1Mat = new THREE.PointsMaterial({
        size: 1.8,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
      });
      const trail1Points = new THREE.Points(trail1Geo, trail1Mat);
      scene.add(trail1Points);

      // Light Trail 2: Red/Crimson Taillight Streaks (Opposing Lane)
      const trail2Count = 140;
      const trail2Geo = new THREE.BufferGeometry();
      const trail2Positions = new Float32Array(trail2Count * 3);
      const colorRed = new THREE.Color(colors.lightTrail2);

      for (let i = 0; i < trail2Count; i++) {
        const t = (i / trail2Count);
        const pt = highwayCurve.getPoint(t);
        trail2Positions[i * 3] = pt.x + 0.8 + (Math.random() - 0.5) * 0.4;
        trail2Positions[i * 3 + 1] = pt.y + 0.35;
        trail2Positions[i * 3 + 2] = pt.z + 0.8 + (Math.random() - 0.5) * 0.4;
      }

      trail2Geo.setAttribute('position', new THREE.BufferAttribute(trail2Positions, 3));
      const trail2Mat = new THREE.PointsMaterial({
        size: 1.6,
        color: colorRed,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending
      });
      const trail2Points = new THREE.Points(trail2Geo, trail2Mat);
      scene.add(trail2Points);

      return { highwayCurve, trail1Points, trail2Points, trail1Positions, trail2Positions, trail1Count, trail2Count };
    };

    const highwayObj = createCurvedHighway();

    // 8. Atmospheric Ambient Particles (floating smart IoT data packets)
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 120;
      particlePositions[i + 1] = Math.random() * 40 + 2;
      particlePositions[i + 2] = (Math.random() - 0.5) * 120;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.75,
      color: colors.neonAccent,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    });
    const particleField = new THREE.Points(particleGeo, particleMat);
    scene.add(particleField);

    // 9. Raycaster for Interactive Hover Detection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      // Mouse drag rotation
      if (isInteractingRef.current) {
        mousePosRef.current.targetX += e.movementX * 0.005;
        mousePosRef.current.targetY = Math.max(-0.6, Math.min(0.6, mousePosRef.current.targetY + e.movementY * 0.005));
      }

      // Check hover intersections
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(clickableMeshes, false);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const b = hit.userData;
        if (b && b.name) {
          setHoveredObject({
            name: b.name,
            type: b.type,
            details: b.details,
            status: b.status,
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
          });
        }
      } else {
        setHoveredObject(null);
      }
    };

    const handlePointerDown = () => {
      isInteractingRef.current = true;
    };

    const handlePointerUp = () => {
      isInteractingRef.current = false;
    };

    const handleClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(clickableMeshes, false);
      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        if (hit.userData?.name && onSelectBuilding) {
          onSelectBuilding(hit.userData.name);
        }
      }
    };

    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mouseup', handlePointerUp);
    container.addEventListener('click', handleClick);

    // 10. Animation Loop
    let angle = Math.PI / 4;
    const distance = 65;

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      timeRef.current += 0.012;

      // Camera Orbit logic
      if (autoRotateRef.current && !isInteractingRef.current) {
        angle += 0.0018;
      }
      angle += mousePosRef.current.targetX * 0.05;
      mousePosRef.current.targetX *= 0.92;

      const targetCamY = 32 + mousePosRef.current.targetY * 20;
      camera.position.x = Math.sin(angle) * distance;
      camera.position.z = Math.cos(angle) * distance;
      camera.position.y += (targetCamY - camera.position.y) * 0.05;
      camera.lookAt(0, 10, 0);

      // Animate Traffic Light Trails along highway curve
      const pos1 = highwayObj.trail1Positions;
      const count1 = highwayObj.trail1Count;
      for (let i = 0; i < count1; i++) {
        // Speed flowing forward
        let t = (i / count1 + timeRef.current * 0.18) % 1.0;
        const pt = highwayObj.highwayCurve.getPoint(t);
        pos1[i * 3] = pt.x - 0.7;
        pos1[i * 3 + 1] = pt.y + 0.35;
        pos1[i * 3 + 2] = pt.z - 0.7;
      }
      highwayObj.trail1Points.geometry.attributes.position.needsUpdate = true;

      // Animate Opposing Taillights (reverse direction)
      const pos2 = highwayObj.trail2Positions;
      const count2 = highwayObj.trail2Count;
      for (let i = 0; i < count2; i++) {
        let t = (1.0 - (i / count2 + timeRef.current * 0.14) % 1.0);
        const pt = highwayObj.highwayCurve.getPoint(t);
        pos2[i * 3] = pt.x + 0.7;
        pos2[i * 3 + 1] = pt.y + 0.35;
        pos2[i * 3 + 2] = pt.z + 0.7;
      }
      highwayObj.trail2Points.geometry.attributes.position.needsUpdate = true;

      // Pulse particle dust
      particleField.rotation.y = timeRef.current * 0.04;

      renderer.render(scene, camera);
    };

    animate();

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
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mouseup', handlePointerUp);
      container.removeEventListener('click', handleClick);
      renderer.dispose();
    };
  }, [activeTheme]);

  // Camera Zoom Actions
  const handleZoom = (delta: number) => {
    if (!cameraRef.current) return;
    const cam = cameraRef.current;
    const dir = new THREE.Vector3();
    cam.getWorldDirection(dir);
    cam.position.addScaledVector(dir, delta);
  };

  const handleResetCamera = () => {
    if (!cameraRef.current) return;
    cameraRef.current.position.set(45, 32, 55);
    cameraRef.current.lookAt(0, 8, 0);
  };

  return (
    <div className={`relative w-full rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 select-none ${className} ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}`}>
      {/* Three.js Canvas Container */}
      <div 
        ref={containerRef} 
        className="w-full h-full min-h-[440px] cursor-grab active:cursor-grabbing" 
      />

      {/* Floating 3D Telemetry Tooltip on Hover */}
      {hoveredObject && (
        <div
          style={{
            left: `${hoveredObject.x + 16}px`,
            top: `${hoveredObject.y - 12}px`
          }}
          className="absolute z-20 pointer-events-none transform -translate-y-1/2 bg-slate-900/90 backdrop-blur-md text-white p-3 rounded-2xl border border-cyan-500/40 shadow-xl max-w-xs space-y-1 animate-in fade-in duration-150"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
              {hoveredObject.type}
            </span>
            <span className="text-[9px] font-mono bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
              {hoveredObject.status}
            </span>
          </div>
          <p className="text-xs font-black text-white">{hoveredObject.name}</p>
          <p className="text-[11px] text-slate-300 leading-tight">{hoveredObject.details}</p>
          <div className="pt-1 text-[9px] text-slate-400 font-mono flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span>Click to inspect telemetry</span>
          </div>
        </div>
      )}

      {/* Top HUD Overlay: 3D City Digital Twin Title & Time of Day Selector */}
      <div className="absolute top-4 left-4 right-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pointer-events-none z-10">
        <div className="bg-slate-950/80 backdrop-blur-md border border-white/10 px-4 py-2.5 rounded-2xl text-white pointer-events-auto shadow-lg">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              3D Smart Society Digital Twin
            </h4>
            <span className="text-[9px] font-mono bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/30">
              REAL-TIME SYNC
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-mono mt-0.5">
            Rotatable isometric campus · Click any high-rise to view live status
          </p>
        </div>

        {/* Controls: Time of Day, Auto-Rotate, Fullscreen */}
        <div className="flex items-center gap-2 pointer-events-auto flex-wrap">
          {/* Theme / Time-of-Day Buttons */}
          <div className="flex items-center bg-slate-950/80 backdrop-blur-md p-1 rounded-2xl border border-white/10 text-xs">
            <button
              onClick={() => setActiveTheme('twilight')}
              className={`px-3 py-1.5 rounded-xl font-bold text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTheme === 'twilight'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Twilight Atmosphere"
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Twilight</span>
            </button>

            <button
              onClick={() => setActiveTheme('cyber')}
              className={`px-3 py-1.5 rounded-xl font-bold text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTheme === 'cyber'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Cyber Neon Grid"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cyber</span>
            </button>

            <button
              onClick={() => setActiveTheme('sunset')}
              className={`px-3 py-1.5 rounded-xl font-bold text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTheme === 'sunset'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Sunset Horizon"
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Sunset</span>
            </button>
          </div>

          {/* Auto Rotate Toggle */}
          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`p-2.5 rounded-2xl backdrop-blur-md border text-xs font-bold transition-colors cursor-pointer ${
              isAutoRotating
                ? 'bg-blue-600/30 text-cyan-300 border-cyan-500/50'
                : 'bg-slate-950/80 text-slate-400 border-white/10 hover:text-white'
            }`}
            title={isAutoRotating ? 'Pause Orbit Rotation' : 'Resume Orbit Rotation'}
          >
            <RotateCw className={`w-4 h-4 ${isAutoRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2.5 bg-slate-950/80 hover:bg-slate-900 backdrop-blur-md border border-white/10 rounded-2xl text-slate-300 hover:text-white transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand Fullscreen 3D'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Bottom Right Zoom & Camera Control Dock */}
      <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 text-white z-10 shadow-lg">
        <button
          onClick={() => handleZoom(8)}
          className="p-2 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4 text-slate-300" />
        </button>
        <button
          onClick={() => handleZoom(-8)}
          className="p-2 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4 text-slate-300" />
        </button>
        <button
          onClick={handleResetCamera}
          className="p-2 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
          title="Reset Camera View"
        >
          <Compass className="w-4 h-4 text-cyan-400" />
        </button>
      </div>

      {/* Bottom Left Real-Time Telemetry Ticker */}
      <div className="absolute bottom-4 left-4 bg-slate-950/80 backdrop-blur-md border border-white/10 px-3.5 py-2 rounded-2xl text-[10px] font-mono text-slate-300 flex items-center gap-3 z-10 shadow-lg pointer-events-none">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-white">4 TOWERS</span>
        </div>
        <span>•</span>
        <span className="text-cyan-300">320 UNITS CONNECTED</span>
        <span>•</span>
        <span className="text-amber-300">TRAFFIC FLOW: 84 VEHICLES/HR</span>
      </div>
    </div>
  );
};
