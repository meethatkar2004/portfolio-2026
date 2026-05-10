"use client";

import { gsap } from 'gsap';
import { Observer } from 'gsap/Observer';
import React, { useEffect, useRef, useState } from 'react';
import {
  ACESFilmicToneMapping,
  AmbientLight,
  Group,
  MathUtils,
  Mesh,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  Plane,
  PMREMGenerator,
  PointLight,
  Raycaster,
  Scene,
  SphereGeometry,
  SRGBColorSpace,
  TextureLoader,
  Vector2,
  Vector3,
  WebGLRenderer,
  WebGLRendererParameters
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

gsap.registerPlugin(Observer);

// Skill definitions with webp textures
const SKILLS = [
  { name: 'Next.js', image: '/skills/next_js.webp' },
  { name: 'TypeScript', image: '/skills/typescript.webp' },
  { name: 'Three.js', image: '/skills/three_js.webp' },
  { name: 'Tailwind CSS', image: '/skills/tailwind_css.webp' },
  { name: 'Redux', image: '/skills/redux.webp' },
  { name: 'Python', image: '/skills/python.webp' },
  { name: 'Docker', image: '/skills/docker.webp' },
  { name: 'GitHub', image: '/skills/github.webp' },
  { name: 'Grafana', image: '/skills/grafana.webp' }
];

interface BallpitConfig {
  canvas?: HTMLCanvasElement;
  id?: string;
  rendererOptions?: Partial<WebGLRendererParameters>;
  size?: 'parent' | { width: number; height: number };
}

interface SizeData {
  width: number;
  height: number;
  wWidth: number;
  wHeight: number;
  ratio: number;
  pixelRatio: number;
}

/**
 * Manages the Three.js scene, camera, and renderer.
 */
class BallpitEngine {
  #config: BallpitConfig;
  #resizeObserver?: ResizeObserver;
  #intersectionObserver?: IntersectionObserver;
  #resizeTimer?: number;
  #animationFrameId: number = 0;
  #lastTime: number = 0;
  #animationState = { elapsed: 0, delta: 0 };
  #isAnimating: boolean = false;
  #isVisible: boolean = false;

  canvas!: HTMLCanvasElement;
  camera!: PerspectiveCamera;
  scene!: Scene;
  renderer!: WebGLRenderer;
  size: SizeData = { width: 0, height: 0, wWidth: 0, wHeight: 0, ratio: 0, pixelRatio: 0 };

  cameraMinAspect?: number;
  cameraMaxAspect?: number;
  cameraFov: number = 45;
  maxPixelRatio: number = 2;
  minPixelRatio: number = 1;

  onBeforeRender: (state: { elapsed: number; delta: number }) => void = () => {};
  onAfterResize: (size: SizeData) => void = () => {};
  isDisposed: boolean = false;

  constructor(config: BallpitConfig) {
    this.#config = { ...config };
    this.#initCamera();
    this.#initScene();
    this.#initRenderer();
    this.#initObservers();
    this.resize();
  }

  #initCamera() {
    this.camera = new PerspectiveCamera(this.cameraFov, 1, 0.1, 1000);
    this.camera.position.set(0, 0, 20);
    this.camera.lookAt(0, 0, 0);
  }

  #initScene() {
    this.scene = new Scene();
  }

  #initRenderer() {
    if (this.#config.canvas) {
      this.canvas = this.#config.canvas;
    } else if (this.#config.id) {
      const elem = document.getElementById(this.#config.id);
      if (elem instanceof HTMLCanvasElement) {
        this.canvas = elem;
      }
    }
    
    if (!this.canvas) {
      console.error('BallpitEngine: Missing canvas element');
      return;
    }

    const rendererOptions: WebGLRendererParameters = {
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      ...(this.#config.rendererOptions ?? {})
    };

    this.renderer = new WebGLRenderer(rendererOptions);
    this.renderer.outputColorSpace = SRGBColorSpace;
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.setClearColor(0x000000, 0);
  }

  #initObservers() {
    if (!(this.#config.size instanceof Object)) {
      window.addEventListener('resize', this.#onResize);
      if (this.#config.size === 'parent' && this.canvas.parentNode) {
        this.#resizeObserver = new ResizeObserver(() => this.#onResize());
        this.#resizeObserver.observe(this.canvas.parentNode as Element);
      }
    }
    
    this.#intersectionObserver = new IntersectionObserver((entries) => {
      this.#isAnimating = entries[0].isIntersecting;
      if (this.#isAnimating) {
        this.#startAnimation();
      } else {
        this.#stopAnimation();
      }
    }, { threshold: 0 });
    
    this.#intersectionObserver.observe(this.canvas);
    document.addEventListener('visibilitychange', this.#onVisibilityChange);
  }

  #onResize = () => {
    if (this.#resizeTimer) clearTimeout(this.#resizeTimer);
    this.#resizeTimer = window.setTimeout(() => this.resize(), 50);
  };

  #onVisibilityChange = () => {
    if (this.#isAnimating) {
      if (document.hidden) {
        this.#stopAnimation();
      } else {
        this.#startAnimation();
      }
    }
  };

  #adjustFov(aspect: number) {
    const tanFov = Math.tan(MathUtils.degToRad(this.cameraFov / 2));
    const newTan = tanFov / (this.camera.aspect / aspect);
    this.camera.fov = 2 * MathUtils.radToDeg(Math.atan(newTan));
  }

  resize() {
    if (this.isDisposed) return;
    
    let w, h;
    if (this.#config.size instanceof Object) {
      const sizeObj = this.#config.size as { width: number; height: number };
      w = sizeObj.width;
      h = sizeObj.height;
    } else if (this.#config.size === 'parent' && this.canvas.parentNode) {
      w = (this.canvas.parentNode as HTMLElement).offsetWidth;
      h = (this.canvas.parentNode as HTMLElement).offsetHeight;
    } else {
      w = window.innerWidth;
      h = window.innerHeight;
    }

    if (w === 0 || h === 0) return;

    this.size.width = w;
    this.size.height = h;
    this.size.ratio = w / h;
    
    let pr = window.devicePixelRatio;
    if (this.maxPixelRatio && pr > this.maxPixelRatio) pr = this.maxPixelRatio;
    if (this.minPixelRatio && pr < this.minPixelRatio) pr = this.minPixelRatio;
    this.size.pixelRatio = pr;

    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(pr);

    this.camera.aspect = this.size.ratio;
    
    if (this.cameraMinAspect && this.camera.aspect < this.cameraMinAspect) {
      this.#adjustFov(this.cameraMinAspect);
    } else if (this.cameraMaxAspect && this.camera.aspect > this.cameraMaxAspect) {
      this.#adjustFov(this.cameraMaxAspect);
    } else {
      this.camera.fov = this.cameraFov;
    }
    
    this.camera.updateProjectionMatrix();

    const fovRad = MathUtils.degToRad(this.camera.fov);
    this.size.wHeight = 2 * Math.tan(fovRad / 2) * this.camera.position.z;
    this.size.wWidth = this.size.wHeight * this.camera.aspect;

    this.onAfterResize(this.size);
  }

  #startAnimation() {
    if (this.#isVisible || this.isDisposed) return;
    this.#isVisible = true;
    this.#lastTime = performance.now();
    
    const animate = (time: number) => {
      if (!this.#isVisible) return;
      this.#animationFrameId = requestAnimationFrame(animate);
      
      const delta = (time - this.#lastTime) / 1000;
      this.#lastTime = time;
      
      this.#animationState.delta = Math.min(delta, 0.1);
      this.#animationState.elapsed += this.#animationState.delta;
      
      this.onBeforeRender(this.#animationState);
      this.renderer.render(this.scene, this.camera);
    };
    
    animate(performance.now());
  }

  #stopAnimation() {
    this.#isVisible = false;
    cancelAnimationFrame(this.#animationFrameId);
  }

  dispose() {
    this.isDisposed = true;
    this.#stopAnimation();
    window.removeEventListener('resize', this.#onResize);
    this.#resizeObserver?.disconnect();
    this.#intersectionObserver?.disconnect();
    document.removeEventListener('visibilitychange', this.#onVisibilityChange);
    
    this.scene.traverse((obj) => {
      if (obj instanceof Mesh) {
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else {
          obj.material.dispose();
        }
      }
    });
    
    this.renderer.dispose();
  }
}

/**
 * Handles physics simulation for the balls.
 */
class PhysicsWorld {
  config: typeof DEFAULT_CONFIG;
  positions: Float32Array;
  velocities: Float32Array;
  sizes: Float32Array;
  center: Vector3 = new Vector3();

  constructor(config: typeof DEFAULT_CONFIG) {
    this.config = config;
    const count = config.count;
    this.positions = new Float32Array(count * 3);
    this.velocities = new Float32Array(count * 3);
    this.sizes = new Float32Array(count);
    
    this.#init(count);
  }

  #init(count: number) {
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      this.positions[i3] = MathUtils.randFloatSpread(this.config.maxX * 0.8 || 4);
      this.positions[i3 + 1] = MathUtils.randFloatSpread(this.config.maxY * 0.8 || 4);
      this.positions[i3 + 2] = MathUtils.randFloatSpread(this.config.maxZ * 0.8 || 1);
      
      this.sizes[i] = MathUtils.randFloat(this.config.minSize, this.config.maxSize);
    }
  }

  update(delta: number) {
    const { count, gravity, friction, wallBounce, maxVelocity, maxX, maxY, maxZ, controlSphere0 } = this.config;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      if (i === 0 && controlSphere0) {
        const targetX = this.center.x;
        const targetY = this.center.y;
        this.positions[i3] += (targetX - this.positions[i3]) * 0.2;
        this.positions[i3 + 1] += (targetY - this.positions[i3 + 1]) * 0.2;
        this.positions[i3 + 2] += (this.center.z - this.positions[i3 + 2]) * 0.2;
        continue;
      }

      this.velocities[i3 + 1] -= gravity * delta;
      
      this.velocities[i3] *= friction;
      this.velocities[i3 + 1] *= friction;
      this.velocities[i3 + 2] *= friction;

      const vx = this.velocities[i3];
      const vy = this.velocities[i3 + 1];
      const vz = this.velocities[i3 + 2];
      const speed = Math.sqrt(vx * vx + vy * vy + vz * vz);
      
      if (speed > maxVelocity) {
        const ratio = maxVelocity / speed;
        this.velocities[i3] *= ratio;
        this.velocities[i3 + 1] *= ratio;
        this.velocities[i3 + 2] *= ratio;
      }

      this.positions[i3] += this.velocities[i3];
      this.positions[i3 + 1] += this.velocities[i3 + 1];
      this.positions[i3 + 2] += this.velocities[i3 + 2];

      const radius = this.sizes[i];
      
      if (Math.abs(this.positions[i3]) + radius > maxX) {
        this.positions[i3] = Math.sign(this.positions[i3]) * (maxX - radius);
        this.velocities[i3] *= -wallBounce;
      }
      if (this.positions[i3 + 1] - radius < -maxY) {
        this.positions[i3 + 1] = -maxY + radius;
        this.velocities[i3 + 1] *= -wallBounce;
      } else if (this.positions[i3 + 1] + radius > maxY) {
        this.positions[i3 + 1] = maxY - radius;
        this.velocities[i3 + 1] *= -wallBounce;
      }
      if (Math.abs(this.positions[i3 + 2]) + radius > maxZ) {
        this.positions[i3 + 2] = Math.sign(this.positions[i3 + 2]) * (maxZ - radius);
        this.velocities[i3 + 2] *= -wallBounce;
      }
    }

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const r1 = this.sizes[i];
      
      for (let j = i + 1; j < count; j++) {
        const j3 = j * 3;
        const r2 = this.sizes[j];
        
        const dx = this.positions[j3] - this.positions[i3];
        const dy = this.positions[j3 + 1] - this.positions[i3 + 1];
        const dz = this.positions[j3 + 2] - this.positions[i3 + 2];
        const distSq = dx * dx + dy * dy + dz * dz;
        const minDist = r1 + r2;

        if (distSq < minDist * minDist) {
          const dist = Math.sqrt(distSq) || 0.001;
          const overlap = (minDist - dist) / 2;
          const nx = dx / dist;
          const ny = dy / dist;
          const nz = dz / dist;

          if (!(i === 0 && controlSphere0)) {
            this.positions[i3] -= nx * overlap;
            this.positions[i3 + 1] -= ny * overlap;
            this.positions[i3 + 2] -= nz * overlap;
            
            this.velocities[i3] -= nx * overlap * 0.5;
            this.velocities[i3 + 1] -= ny * overlap * 0.5;
            this.velocities[i3 + 2] -= nz * overlap * 0.5;
          }
          
          this.positions[j3] += nx * overlap;
          this.positions[j3 + 1] += ny * overlap;
          this.positions[j3 + 2] += nz * overlap;
          
          this.velocities[j3] += nx * overlap * 0.5;
          this.velocities[j3 + 1] += ny * overlap * 0.5;
          this.velocities[j3 + 2] += nz * overlap * 0.5;
        }
      }
    }
  }
}

const DEFAULT_CONFIG = {
  count: SKILLS.length,
  minSize: 1.2,
  maxSize: 1.5,
  gravity: 15.0,
  friction: 0.99,
  wallBounce: 0.7,
  maxVelocity: 0.5,
  maxX: 5,
  maxY: 5,
  maxZ: 2,
  controlSphere0: false
};

interface SkillsBallpitProps {
  className?: string;
  followCursor?: boolean;
  maxBalls?: number;
  gravity?: number;
  friction?: number;
  wallBounce?: number;
}

const SkillsBallpit: React.FC<SkillsBallpitProps> = ({ 
  className = '', 
  followCursor = false,
  maxBalls = SKILLS.length,
  gravity = 15.0,
  friction = 0.99,
  wallBounce = 0.7
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<BallpitEngine | null>(null);
  const ballsRef = useRef<Mesh[]>([]);
  const physicsRef = useRef<PhysicsWorld | null>(null);
  const [hoveredProject, setHoveredProject] = useState<{ name: string; image: string } | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!canvasRef.current) return;

    // Reset balls array to prevent index mismatch between renders
    ballsRef.current = [];

    const engine = new BallpitEngine({ canvas: canvasRef.current, size: 'parent' });
    engineRef.current = engine;

    const count = Math.min(maxBalls || SKILLS.length, SKILLS.length);
    const config = { 
      ...DEFAULT_CONFIG, 
      count, 
      gravity, 
      friction, 
      wallBounce, 
      controlSphere0: followCursor 
    };
    
    const physics = new PhysicsWorld(config);
    physicsRef.current = physics;

    const pmrem = new PMREMGenerator(engine.renderer);
    const envTexture = pmrem.fromScene(new RoomEnvironment()).texture;

    const ambientLight = new AmbientLight(0xffffff, 2);
    engine.scene.add(ambientLight);
    
    const pointLight = new PointLight(0xffffff, 50, 100);
    engine.scene.add(pointLight);

    const textureLoader = new TextureLoader();
    const geometry = new SphereGeometry(1, 32, 32);
    const ballsGroup = new Group();
    engine.scene.add(ballsGroup);

    SKILLS.slice(0, count).forEach((project, i) => {
      const texture = textureLoader.load(project.image);
      texture.colorSpace = SRGBColorSpace;
      
      const material = new MeshPhysicalMaterial({
        map: texture,
        envMap: envTexture,
        metalness: 0.1,
        roughness: 0.3,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        color: 0xaaaaaa // Base color to show while texture loads
      });

      const mesh = new Mesh(geometry, material);
      mesh.scale.setScalar(physics.sizes[i]);
      ballsGroup.add(mesh);
      mesh.userData = { project }; // Store the skill/project data for hover
      ballsRef.current.push(mesh);
    });

    const raycaster = new Raycaster();
    const pointer = new Vector2();

    engine.onAfterResize = (size) => {
      physics.config.maxX = size.wWidth / 2;
      physics.config.maxY = size.wHeight / 2;
    };

    engine.onBeforeRender = ({ delta }) => {
      physics.update(delta);
      
      ballsRef.current.forEach((mesh, i) => {
        const i3 = i * 3;
        // Check if values are valid numbers before setting
        if (!isNaN(physics.positions[i3])) {
          mesh.position.set(physics.positions[i3], physics.positions[i3 + 1], physics.positions[i3 + 2]);
          
          if (i === 0) pointLight.position.copy(mesh.position);
        }
      });
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!canvasRef.current || !engineRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      
      raycaster.setFromCamera(pointer, engine.camera);
      const plane = new Plane(new Vector3(0, 0, 1), 0);
      const intersect = new Vector3();
      raycaster.ray.intersectPlane(plane, intersect);
      physics.center.copy(intersect);

      const intersects = raycaster.intersectObjects(ballsRef.current);
      if (intersects.length > 0) {
        const mesh = intersects[0].object as Mesh;
        const index = ballsRef.current.indexOf(mesh);
        if (index !== -1) {
          setHoveredProject(SKILLS[index]);
          
          const ballPos = mesh.position.clone();
          ballPos.project(engine.camera);
          setTooltipPos({
            x: (ballPos.x + 1) / 2 * rect.width + rect.left,
            y: (1 - ballPos.y) / 2 * rect.height + rect.top - 20
          });
        }
      } else {
        setHoveredProject(null);
      }
    };

    const currentCanvas = canvasRef.current;
    if (currentCanvas) {
      currentCanvas.addEventListener('pointermove', handlePointerMove);
    }

    return () => {
      engine.dispose();
      if (currentCanvas) {
        currentCanvas.removeEventListener('pointermove', handlePointerMove);
      }
      ballsRef.current = [];
    };
  }, [maxBalls, followCursor, gravity, friction, wallBounce]);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <canvas 
        ref={canvasRef} 
        className="w-full h-full block touch-none"
      />
      
      {hoveredProject && (
        <div
          className="fixed px-4 py-2 bg-black/80 backdrop-blur-md text-white text-sm font-bold rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-full whitespace-nowrap shadow-2xl z-50 border border-white/20 flex items-center gap-2"
          style={{
            left: tooltipPos.x,
            top: tooltipPos.y,
            transition: 'top 0.1s ease-out, left 0.1s ease-out',
            animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
        >
          {hoveredProject.name}
        </div>
      )}

      <style>{`
        @keyframes popIn {
          from { 
            opacity: 0; 
            transform: translate(-50%, -80%) scale(0.8); 
          }
          to { 
            opacity: 1; 
            transform: translate(-50%, -100%) scale(1); 
          }
        }
      `}</style>
    </div>
  );
};

export default SkillsBallpit;