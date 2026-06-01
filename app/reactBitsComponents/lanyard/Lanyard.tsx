/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useRef, useState, useMemo } from 'react';
import { Canvas, extend, useFrame, ThreeEvent } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
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
  isMobile?: boolean;
}

export default function Lanyard({
  position = [0, 0, 30],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
  isMobile = false
}: LanyardProps) {
  const [isClient, setIsClient] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, { threshold: 0 });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative z-0 w-full h-full flex justify-self-end items-end">
      {isClient && (
        <Canvas
          key={position.join(',')}
          frameloop={isVisible ? 'always' : 'never'}
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
      )}
    </div>
  );
}

interface BandProps {
  maxSpeed?: number;
  minSpeed?: number;
  isMobile?: boolean;
}



import { useCursor } from '../../context/CursorContext';

function Band({ maxSpeed = 50, minSpeed = 0, isMobile = false }: BandProps) {
  const { setCursorType } = useCursor();
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
    colliders: false as const,
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
  }); const [dragged, drag] = useState<false | THREE.Vector3>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], isMobile ? 2.4 : 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], isMobile ? 2.4 : 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], isMobile ? 2.4 : 1]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.45, 0]
  ]);
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
      let needsUpdate = false;

      [j1, j2].forEach(ref => {
        if (!(ref.current as any).lerped) {
          (ref.current as any).lerped = new THREE.Vector3().copy(ref.current.translation());
        }
        const lerpedVec = (ref.current as any).lerped as THREE.Vector3;
        const target = ref.current.translation();
        const dist = lerpedVec.distanceTo(target);

        if (dist > 0.005) {
          needsUpdate = true;
          const clampedDistance = Math.max(0.1, Math.min(1, dist));
          lerpedVec.lerp(target, delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)));
        } else {
          lerpedVec.copy(target);
        }
      });

      const j3Pos = j3.current.translation();
      if (curve.points[0].distanceTo(j3Pos as unknown as THREE.Vector3) > 0.005) {
        needsUpdate = true;
      }

      const fixedPos = fixed.current.translation();
      if (curve.points[3].distanceTo(fixedPos as unknown as THREE.Vector3) > 0.005) {
        needsUpdate = true;
      }

      if (needsUpdate) {
        curve.points[0].copy(j3Pos as unknown as THREE.Vector3);
        curve.points[1].copy((j2.current as any).lerped);
        curve.points[2].copy((j1.current as any).lerped);
        curve.points[3].copy(fixedPos as unknown as THREE.Vector3);

        if (band.current?.geometry) {
          const geometry = band.current.geometry as any;
          geometry.setPoints(curve.getPoints(isMobile ? 16 : 32));
        }
      }

      ang.copy(card.current.angvel() as unknown as THREE.Vector3);
      rot.copy(card.current.rotation() as unknown as THREE.Vector3);
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, true);
    }
  });

  // Lanyard texture settings are now handled in the setup useEffect above

  return (
    <>
      <group position={isMobile ? [0, 8, 0] : [2, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={isMobile ? [0, 0, 0] : [0.5, 0, 0]} ref={j1} {...segmentProps} type="dynamic">
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={isMobile ? [0, 0, 0] : [1, 0, 0]} ref={j2} {...segmentProps} type="dynamic">
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={isMobile ? [0, 0, 0] : [1.5, 0, 0]} ref={j3} {...segmentProps} type="dynamic">
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={isMobile ? [0, 0, 0] : [2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={1.7}
            position={[0, -0.62, -0.05]}
          >
            <group
              onPointerEnter={(e) => {
                e.stopPropagation();
                hover(true);
                setCursorType('drag');
              }}
              onPointerLeave={() => {
                hover(false);
                setCursorType('default');
              }}
              onPointerUp={(e: ThreeEvent<PointerEvent>) => {
                const target = e.target as any;
                if (target?.releasePointerCapture) {
                  target.releasePointerCapture(e.pointerId);
                }
                drag(false);
                hover(false);
                setCursorType('default');
              }}
              onPointerDown={(e: ThreeEvent<PointerEvent>) => {
                e.stopPropagation();
                const target = e.target as any;
                if (target?.setPointerCapture) {
                  target.setPointerCapture(e.pointerId);
                }
                drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())));
                setCursorType('dragging');
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
            </group>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh
        ref={band}
        onPointerEnter={(e) => {
          e.stopPropagation();
          setCursorType('default');
        }}
      >
        {/* @ts-expect-error - Custom R3F element */}
        <meshLineGeometry />
        {/* @ts-expect-error - Custom R3F element */}
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