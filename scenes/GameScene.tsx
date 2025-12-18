
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Planet, FleetGroup, Owner } from '../types';
import { COLORS } from '../constants';

interface GameSceneProps {
  planets: Planet[];
  fleets: FleetGroup[];
  selectedPlanetId: string | null;
  onPlanetClick: (id: string) => void;
}

const GameScene: React.FC<GameSceneProps> = ({ planets, fleets, selectedPlanetId, onPlanetClick }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  
  const planetsGroupRef = useRef<THREE.Group>(new THREE.Group());
  const fleetsGroupRef = useRef<THREE.Group>(new THREE.Group());
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  // Initialization
  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x00050a);
    sceneRef.current = scene;

    // Add Stars
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 5000;
    const posArray = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 400;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const starMaterial = new THREE.PointsMaterial({ size: 0.1, color: 0xffffff });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 50;
    camera.position.y = 20;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1.5);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    scene.add(planetsGroupRef.current);
    scene.add(fleetsGroupRef.current);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    const handleClick = (event: MouseEvent) => {
      if (!mountRef.current) return;
      mouse.x = (event.clientX / mountRef.current.clientWidth) * 2 - 1;
      mouse.y = -(event.clientY / mountRef.current.clientHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(planetsGroupRef.current.children);
      if (intersects.length > 0) {
        const id = (intersects[0].object as any).planetId;
        onPlanetClick(id);
      }
    };
    mountRef.current.addEventListener('mousedown', handleClick);

    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeEventListener('mousedown', handleClick);
      renderer.dispose();
    };
  }, []);

  // Sync Planets
  useEffect(() => {
    if (!sceneRef.current) return;
    
    // Clear old meshes
    while (planetsGroupRef.current.children.length > 0) {
      planetsGroupRef.current.remove(planetsGroupRef.current.children[0]);
    }

    planets.forEach(p => {
      const geometry = new THREE.SphereGeometry(p.size, 32, 32);
      const color = COLORS[p.owner];
      const material = new THREE.MeshPhongMaterial({ 
        color, 
        emissive: color, 
        emissiveIntensity: 0.2,
        shininess: 30
      });
      const mesh = new THREE.Mesh(geometry, material) as any;
      mesh.position.copy(p.position);
      mesh.planetId = p.id;
      
      // Selection ring
      if (selectedPlanetId === p.id) {
        const ringGeo = new THREE.RingGeometry(p.size + 0.3, p.size + 0.5, 32);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        mesh.add(ring);
      }

      planetsGroupRef.current.add(mesh);
    });
  }, [planets, selectedPlanetId]);

  // Sync Fleets
  useEffect(() => {
    if (!sceneRef.current) return;

    while (fleetsGroupRef.current.children.length > 0) {
      fleetsGroupRef.current.remove(fleetsGroupRef.current.children[0]);
    }

    fleets.forEach(f => {
      const from = planets.find(p => p.id === f.fromId);
      const to = planets.find(p => p.id === f.toId);
      if (!from || !to) return;

      const currentPos = new THREE.Vector3().lerpVectors(from.position, to.position, f.progress);
      
      const fleetGeo = new THREE.SphereGeometry(0.15, 8, 8);
      const fleetMat = new THREE.MeshBasicMaterial({ color: COLORS[f.owner] });
      const fleetMesh = new THREE.Mesh(fleetGeo, fleetMat);
      fleetMesh.position.copy(currentPos);
      
      fleetsGroupRef.current.add(fleetMesh);
    });
  }, [fleets, planets]);

  return <div ref={mountRef} className="w-full h-full cursor-pointer" />;
};

export default GameScene;
