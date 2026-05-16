/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unknown-property */
'use client';
import { useEffect, useRef, useState, useMemo } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  RigidBodyProps,
  RapierRigidBody
} from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';

extend({ MeshLineGeometry, MeshLineMaterial });

// Paths to assets in public folder
const cardGLB = '/assets/lanyard/card.glb';
const lanyardTexturePath = '/assets/lanyard/lanyard.png';

interface LanyardProps {
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
}

export default function Lanyard({
  position = [0, 0, 30],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true
}: LanyardProps) {
  const [isMobile, setIsMobile] = useState<boolean>(() => 
    typeof window !== 'undefined' && window.innerWidth < 768
  );

  useEffect(() => {
    const handleResize = (): void => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative z-0 w-screen h-full flex justify-self-end items-end">
      <Canvas
        camera={{ position, fov }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ alpha: transparent }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0xC0C0C0), transparent ? 0 : 1)}
      >
        <ambientLight intensity={Math.PI} />
        <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
          <Band isMobile={isMobile} />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer
            intensity={2}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={10}
            color="white"
            position={[-10, 0, 14]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          />
        </Environment>
      </Canvas>
    </div>
  );
}

interface BandProps {
  maxSpeed?: number;
  minSpeed?: number;
  isMobile?: boolean;
}

interface RigidBodyRef {
  current: RapierRigidBody;
  lerped?: THREE.Vector3;
}

function Band({ maxSpeed = 50, minSpeed = 0, isMobile = false }: BandProps) {
  const band = useRef<THREE.Mesh>(null);
  const fixed = useRef<RapierRigidBody>(null!);
  const j1 = useRef<RapierRigidBody>(null!);
  const j2 = useRef<RapierRigidBody>(null!);
  const j3 = useRef<RapierRigidBody>(null!);
  const card = useRef<RapierRigidBody>(null!);

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();

  const segmentProps = {
    type: 'dynamic' as const,
    canSleep: true,
    colliders: false,
    angularDamping: 4,
    linearDamping: 4
  };

  const { nodes, materials } = useGLTF(cardGLB) as any;
  const tLanyard = useTexture(lanyardTexturePath);
  const tFront = useTexture('/profile-normal.png');
  const tBack = useTexture('/profile-black.png');

  const texture = useMemo(() => {
    const l = tLanyard.clone();
    l.wrapS = THREE.RepeatWrapping;
    l.wrapT = THREE.RepeatWrapping;
    return l;
  }, [tLanyard]);

  const frontTexture = useMemo(() => {
    const f = tFront.clone();
    f.center.set(0.38, 0.5);
    f.rotation = -Math.PI;
    return f;
  }, [tFront]);

  const backTexture = useMemo(() => {
    const b = tBack.clone();
    b.center.set(0.38, 0.5);
    b.rotation = -Math.PI;
    return b;
  }, [tBack]);

  const [curve] = useState(() => {
    const c = new THREE.CatmullRomCurve3([
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3()
    ]);
    c.curveType = 'chordal';
    return c;
  });

  const [dragged, drag] = useState<false | THREE.Vector3>(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.45, 0]
  ]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handlePointerOver = () => hover(true);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handlePointerOut = () => hover(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handlePointerUp = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (target && 'releasePointerCapture' in target) {
        (target as any).releasePointerCapture((e as any).pointerId);
      }
      drag(false);
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (target && 'setPointerCapture' in target) {
        (target as any).setPointerCapture((e as any).pointerId);
      }
      const point = (e as any).point as THREE.Vector3;
      drag(new THREE.Vector3().copy(point).sub(vec.copy(card.current.translation())));
    };

    return () => {
      // Cleanup
    };
  }, []);

  useFrame((state, delta) => {
    if (dragged && typeof dragged !== 'boolean') {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z
      });
    }

    if (fixed.current) {
      [j1, j2].forEach(ref => {
        if (!(ref.current as any).lerped) {
          (ref.current as any).lerped = new THREE.Vector3().copy(ref.current.translation());
        }
        const lerpedVec = (ref.current as any).lerped as THREE.Vector3;
        const clampedDistance = Math.max(0.1, Math.min(1, lerpedVec.distanceTo(ref.current.translation())));
        lerpedVec.lerp(
          ref.current.translation(),
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
        );
      });

      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy((j2.current as any).lerped);
      curve.points[2].copy((j1.current as any).lerped);
      curve.points[3].copy(fixed.current.translation());

      if (band.current?.geometry) {
        const geometry = band.current.geometry as any;
        geometry.setPoints(curve.getPoints(isMobile ? 16 : 32));
      }

      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, true);
    }
  });

  // Lanyard texture settings are now handled in the setup useEffect above

  return (
    <>
      <group position={[2, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps} type="dynamic">
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps} type="dynamic">
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps} type="dynamic">
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={1.7}
            position={[0, -0.62, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e: THREE.ThreeEvent<PointerEvent>) => {
              const target = e.target as any;
              if (target?.releasePointerCapture) {
                target.releasePointerCapture(e.pointerId);
              }
              drag(false);
            }}
            onPointerDown={(e: THREE.ThreeEvent<PointerEvent>) => {
              const target = e.target as any;
              if (target?.setPointerCapture) {
                target.setPointerCapture(e.pointerId);
              }
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())));
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={frontTexture}
                map-anisotropy={16}
                clearcoat={isMobile ? 0 : 1}
                clearcoatRoughness={0.15}
                roughness={0.9}
                metalness={0.8}
              />
            </mesh>
            <mesh geometry={nodes.card.geometry} rotation={[0, Math.PI, 0]}>
              <meshPhysicalMaterial
                map={backTexture}
                map-anisotropy={16}
                clearcoat={isMobile ? 0 : 1}
                clearcoatRoughness={0.15}
                roughness={0.9}
                metalness={0.8}
                color="white"
              />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
          useMap
          map={texture}
          repeat={[-4, 1]}
          lineWidth={1}
        />
      </mesh>
    </>
  );
}

useGLTF.preload(cardGLB);
useTexture.preload(lanyardTexturePath);