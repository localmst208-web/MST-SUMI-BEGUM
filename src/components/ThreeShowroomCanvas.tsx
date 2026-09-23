import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Product, ThreeDShowroomSettings } from '../types';

interface ThreeShowroomCanvasProps {
  product: Product;
  settings: ThreeDShowroomSettings;
  className?: string;
  isMobile?: boolean;
}

export const ThreeShowroomCanvas: React.FC<ThreeShowroomCanvasProps> = ({
  product,
  settings,
  className = '',
  isMobile = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // User interactive inspection state
  const [isHovered, setIsHovered] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  // References for animation loop
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const garmentGroupRef = useRef<THREE.Group | null>(null);
  const animFrameId = useRef<number | null>(null);
  const pointerRef = useRef({ x: 0, y: 0, prevX: 0, prevY: 0, isDown: false });
  const rotationVelocity = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);

  // Texture generator for cloth weave
  const createFabricTexture = (type: 'silk' | 'wool' | 'linen' | 'zari') => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 256, 256);

    const step = type === 'linen' ? 4 : type === 'wool' ? 3 : 2;
    ctx.fillStyle = type === 'zari' ? '#a09060' : '#909090';

    for (let x = 0; x < 256; x += step) {
      for (let y = 0; y < 256; y += step) {
        if ((x / step + y / step) % 2 === 0) {
          ctx.fillRect(x, y, step / 2, step / 2);
        }
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(type === 'linen' ? 16 : 28, type === 'linen' ? 16 : 28);
    return texture;
  };

  // Build high-fashion 3D cloth geometry based on preset
  const buildClothMesh = (preset: Product['model3dPreset'], colorHex: string): THREE.Group => {
    const group = new THREE.Group();
    const baseColor = new THREE.Color(colorHex);
    const fabricTex = createFabricTexture(
      preset === 'draped-saree' ? 'zari' : preset === 'tailored-blazer' ? 'wool' : 'silk'
    );

    // High quality PBR material
    const material = new THREE.MeshStandardMaterial({
      color: baseColor,
      roughness: preset === 'evening-gown' ? 0.25 : preset === 'baby-romper' ? 0.85 : 0.45,
      metalness: preset === 'draped-saree' ? 0.35 : 0.08,
      bumpMap: fabricTex || undefined,
      bumpScale: 0.015,
      side: THREE.DoubleSide,
      shadowSide: THREE.DoubleSide,
    });

    if (preset === 'evening-gown' || preset === 'luxury-dress') {
      // Flowing bias-cut evening gown with undulating ripples
      const geom = new THREE.CylinderGeometry(0.35, 1.15, 2.8, 48, 48, true);
      const pos = geom.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i);
        const angle = Math.atan2(pos.getZ(i), pos.getX(i));
        const fluting = Math.sin(angle * 7 + y * 2) * 0.08 * (1.2 - y * 0.4);
        const radius = Math.sqrt(pos.getX(i) ** 2 + pos.getZ(i) ** 2) + fluting;
        pos.setX(i, Math.cos(angle) * radius);
        pos.setZ(i, Math.sin(angle) * radius);
      }
      geom.computeVertexNormals();
      const gown = new THREE.Mesh(geom, material);
      gown.position.y = -0.3;
      gown.castShadow = true;
      group.add(gown);

      // Delicate bodice & halter collar
      const bodiceGeom = new THREE.CylinderGeometry(0.42, 0.35, 0.9, 32);
      const bodice = new THREE.Mesh(bodiceGeom, material);
      bodice.position.y = 1.15;
      bodice.castShadow = true;
      group.add(bodice);

      // Minimal floating hanger or gold metallic choker collar
      const collarGeom = new THREE.TorusGeometry(0.28, 0.02, 16, 32);
      const goldMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color('#d4af37'),
        metalness: 0.85,
        roughness: 0.2,
      });
      const collar = new THREE.Mesh(collarGeom, goldMat);
      collar.rotation.x = Math.PI / 2;
      collar.position.y = 1.6;
      group.add(collar);
    } else if (preset === 'draped-saree') {
      // Helical draped pleats & cascading pallu
      const pleatGeom = new THREE.CylinderGeometry(0.45, 0.75, 2.6, 36, 32, true);
      const pos = pleatGeom.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i);
        const angle = Math.atan2(pos.getZ(i), pos.getX(i));
        const pleats = Math.sin(angle * 12) * 0.06 * (0.8 - y * 0.2);
        const r = Math.sqrt(pos.getX(i) ** 2 + pos.getZ(i) ** 2) + pleats;
        pos.setX(i, Math.cos(angle) * r);
        pos.setZ(i, Math.sin(angle) * r);
      }
      pleatGeom.computeVertexNormals();
      const skirt = new THREE.Mesh(pleatGeom, material);
      skirt.position.y = -0.4;
      skirt.castShadow = true;
      group.add(skirt);

      // Gold Pallu drape wrapping diagonally over shoulder
      const palluCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.4, -0.2, 0.2),
        new THREE.Vector3(0.5, 0.6, 0.3),
        new THREE.Vector3(0.2, 1.3, 0.1),
        new THREE.Vector3(-0.35, 1.45, -0.1),
        new THREE.Vector3(-0.6, 0.4, -0.35),
        new THREE.Vector3(-0.7, -0.6, -0.4),
      ]);
      const tubeGeom = new THREE.TubeGeometry(palluCurve, 32, 0.18, 16, false);
      const zariMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color('#d4b358'),
        metalness: 0.75,
        roughness: 0.28,
        bumpMap: fabricTex || undefined,
        bumpScale: 0.03,
      });
      const pallu = new THREE.Mesh(tubeGeom, zariMat);
      pallu.castShadow = true;
      group.add(pallu);

      // Inner structured blouse
      const blouseGeom = new THREE.CylinderGeometry(0.44, 0.42, 0.65, 32);
      const blouse = new THREE.Mesh(blouseGeom, material);
      blouse.position.y = 1.05;
      group.add(blouse);
    } else if (preset === 'baby-romper') {
      // Soft organic knit baby romper silhouette
      const torsoGeom = new THREE.CapsuleGeometry(0.55, 0.85, 16, 32);
      const romper = new THREE.Mesh(torsoGeom, material);
      romper.position.y = 0.3;
      romper.castShadow = true;
      group.add(romper);

      // Cute tiny bloomer leg cuffs
      const legLGeom = new THREE.CylinderGeometry(0.22, 0.2, 0.4, 24);
      const legL = new THREE.Mesh(legLGeom, material);
      legL.position.set(-0.25, -0.5, 0);
      legL.rotation.z = -0.15;
      group.add(legL);

      const legR = new THREE.Mesh(legLGeom, material);
      legR.position.set(0.25, -0.5, 0);
      legR.rotation.z = 0.15;
      group.add(legR);

      // Wooden / pearl buttons down front
      const btnMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color('#eeddc5'),
        roughness: 0.3,
        metalness: 0.1,
      });
      for (let b = 0; b < 3; b++) {
        const btnGeom = new THREE.CylinderGeometry(0.045, 0.045, 0.02, 16);
        const btn = new THREE.Mesh(btnGeom, btnMat);
        btn.rotation.x = Math.PI / 2;
        btn.position.set(0, 0.65 - b * 0.3, 0.56);
        group.add(btn);
      }
    } else if (preset === 'tailored-blazer') {
      // Sculptural sharp shoulders & tailored jacket torso
      const bodyGeom = new THREE.BoxGeometry(0.85, 1.4, 0.5, 16, 16, 16);
      const bPos = bodyGeom.attributes.position;
      for (let i = 0; i < bPos.count; i++) {
        const y = bPos.getY(i);
        // Taper waist, broaden shoulders
        if (y > 0.2) {
          bPos.setX(i, bPos.getX(i) * 1.35);
        } else if (y < -0.2) {
          bPos.setX(i, bPos.getX(i) * 1.05);
        } else {
          bPos.setX(i, bPos.getX(i) * 0.88); // nipped waist
        }
      }
      bodyGeom.computeVertexNormals();
      const jacket = new THREE.Mesh(bodyGeom, material);
      jacket.position.y = 0.4;
      jacket.castShadow = true;
      group.add(jacket);

      // Sleeves
      const sleeveGeom = new THREE.CylinderGeometry(0.18, 0.14, 1.3, 20);
      const sleeveL = new THREE.Mesh(sleeveGeom, material);
      sleeveL.position.set(-0.68, 0.2, 0);
      sleeveL.rotation.z = 0.2;
      group.add(sleeveL);

      const sleeveR = new THREE.Mesh(sleeveGeom, material);
      sleeveR.position.set(0.68, 0.2, 0);
      sleeveR.rotation.z = -0.2;
      group.add(sleeveR);
    } else {
      // Modern Silk Top / Camisole
      const topGeom = new THREE.CylinderGeometry(0.48, 0.68, 1.6, 32, 24, true);
      const top = new THREE.Mesh(topGeom, material);
      top.position.y = 0.3;
      top.castShadow = true;
      group.add(top);
    }

    // Soft circular shadow ring below garment on invisible plane
    const shadowGeom = new THREE.RingGeometry(0.2, 1.2, 32);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x9c8c7c,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
    });
    const shadowMesh = new THREE.Mesh(shadowGeom, shadowMat);
    shadowMesh.rotation.x = Math.PI / 2;
    shadowMesh.position.y = -2.1;
    group.add(shadowMesh);

    return group;
  };

  // Setup Three.js scene
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 700;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Soft distance fog matching white luxury studio tone
    scene.fog = new THREE.FogExp2(0xfaf9f6, 0.035);

    // Camera
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    const camDist = isMobile ? settings.cameraDistance * 1.15 : settings.cameraDistance;
    camera.position.set(0, 0.2, camDist);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: !isMobile,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2.0));
    renderer.shadowMap.enabled = !isMobile;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    rendererRef.current = renderer;

    // Studio 3-Point Lighting
    // 1. Key Light (Warm Champagne)
    const keyLight = new THREE.DirectionalLight(0xfff3e0, settings.lightingIntensity * 1.6);
    keyLight.position.set(4, 5, 4);
    if (!isMobile) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0008;
    }
    scene.add(keyLight);

    // 2. Fill Light (Cool Soft Sky Ambiance)
    const fillLight = new THREE.DirectionalLight(0xdde8ff, settings.lightingIntensity * 0.7);
    fillLight.position.set(-5, 2, 3);
    scene.add(fillLight);

    // 3. Rim / Edge Light (High crisp highlight from rear)
    const rimLight = new THREE.DirectionalLight(0xffffff, settings.lightingIntensity * 1.8);
    rimLight.position.set(0, 4, -4);
    scene.add(rimLight);

    // Ambient baseline
    const ambientLight = new THREE.AmbientLight(0x2a2830, 0.8);
    scene.add(ambientLight);

    // Initial Garment Group
    const garmentGroup = new THREE.Group();
    garmentGroupRef.current = garmentGroup;
    scene.add(garmentGroup);

    // Load or build product mesh
    if (product.model3dUrl && product.model3dPreset === 'custom-glb') {
      const loader = new GLTFLoader();
      loader.load(
        product.model3dUrl,
        (gltf) => {
          garmentGroup.clear();
          const loadedScene = gltf.scene;
          loadedScene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          garmentGroup.add(loadedScene);
        },
        undefined,
        () => {
          // Fallback to procedural mesh
          garmentGroup.clear();
          garmentGroup.add(buildClothMesh(product.model3dPreset, product.colorHex));
        }
      );
    } else {
      garmentGroup.add(buildClothMesh(product.model3dPreset, product.colorHex));
    }

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Animation Render Loop
    let lastTime = performance.now();
    const animate = () => {
      animFrameId.current = requestAnimationFrame(animate);

      const currentTime = performance.now();
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      timeRef.current += delta;

      if (garmentGroupRef.current) {
        // Natural floating bob oscillation
        const bob = Math.sin(timeRef.current * settings.floatingSpeed) * settings.floatingAmplitude;
        garmentGroupRef.current.position.y = bob;

        // Auto slow turntable rotation if not user-dragging
        if (settings.autoRotate && !pointerRef.current.isDown) {
          garmentGroupRef.current.rotation.y += settings.rotationSpeed;
        }

        // Apply inertial drag velocity
        if (!pointerRef.current.isDown) {
          garmentGroupRef.current.rotation.y += rotationVelocity.current.x;
          garmentGroupRef.current.rotation.x += rotationVelocity.current.y;
          // Dampen velocity
          rotationVelocity.current.x *= 0.92;
          rotationVelocity.current.y *= 0.92;
          // Limit X pitch
          garmentGroupRef.current.rotation.x = Math.max(-0.4, Math.min(0.4, garmentGroupRef.current.rotation.x));
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      renderer.dispose();
    };
  }, [settings.lightingIntensity, settings.cameraDistance, isMobile]);

  // When product changes, rebuild mesh smoothly
  useEffect(() => {
    if (!garmentGroupRef.current) return;
    const group = garmentGroupRef.current;

    // Animate scale pulse transition
    let progress = 0;
    const initialScale = settings.productScale;

    // Replace geometry
    group.clear();
    const newMesh = buildClothMesh(product.model3dPreset, product.colorHex);
    group.add(newMesh);

    // Smooth entry scale
    const transitionInterval = setInterval(() => {
      progress += 0.1;
      if (progress >= 1) {
        group.scale.set(initialScale, initialScale, initialScale);
        clearInterval(transitionInterval);
      } else {
        const s = initialScale * (0.85 + 0.15 * Math.sin((progress * Math.PI) / 2));
        group.scale.set(s, s, s);
      }
    }, 16);

    return () => clearInterval(transitionInterval);
  }, [product.id, product.model3dPreset, product.colorHex, settings.productScale]);

  // Pointer Drag Orbit Listeners
  const handlePointerDown = (e: React.PointerEvent) => {
    pointerRef.current.isDown = true;
    pointerRef.current.prevX = e.clientX;
    pointerRef.current.prevY = e.clientY;
    setIsInteracting(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!pointerRef.current.isDown || !garmentGroupRef.current) return;
    const dx = e.clientX - pointerRef.current.prevX;
    const dy = e.clientY - pointerRef.current.prevY;

    pointerRef.current.prevX = e.clientX;
    pointerRef.current.prevY = e.clientY;

    const rotSpeed = 0.007;
    garmentGroupRef.current.rotation.y += dx * rotSpeed;
    garmentGroupRef.current.rotation.x += dy * rotSpeed;

    rotationVelocity.current = { x: dx * rotSpeed * 0.4, y: dy * rotSpeed * 0.4 };
  };

  const handlePointerUp = () => {
    pointerRef.current.isDown = false;
    setTimeout(() => setIsInteracting(false), 800);
  };

  const resetRotation = () => {
    if (garmentGroupRef.current) {
      garmentGroupRef.current.rotation.set(0, 0, 0);
      rotationVelocity.current = { x: 0, y: 0 };
    }
  };

  const toggleZoom = () => {
    if (!cameraRef.current) return;
    const nextZoom = zoomLevel === 1 ? 1.45 : 1;
    setZoomLevel(nextZoom);
    const targetDist = settings.cameraDistance / nextZoom;
    cameraRef.current.position.z = targetDist;
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full select-none cursor-grab active:cursor-grabbing ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <canvas ref={canvasRef} className="w-full h-full block touch-none" />

      {/* Floating 3D Interaction Affordance */}
      <div
        className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/80 text-[11px] font-medium tracking-wider uppercase transition-opacity duration-300 pointer-events-auto ${
          isHovered || isInteracting ? 'opacity-100' : 'opacity-65'
        }`}
      >
        <span className="flex items-center gap-1.5 text-amber-200/90">
          <svg className="w-3.5 h-3.5 animate-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          360° Drag
        </span>
        <span className="text-white/30">·</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleZoom();
          }}
          className="hover:text-white transition-colors cursor-pointer"
        >
          {zoomLevel > 1 ? 'Reset View' : 'Inspect Fabric (Zoom)'}
        </button>
        <span className="text-white/30">·</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            resetRotation();
          }}
          className="hover:text-white transition-colors cursor-pointer"
        >
          Center
        </button>
      </div>
    </div>
  );
};
