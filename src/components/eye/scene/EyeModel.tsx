"use client";

import { useMemo } from "react";
import {
  CatmullRomCurve3,
  CircleGeometry,
  RingGeometry,
  SphereGeometry,
  TubeGeometry,
  Vector3,
} from "three";
import { makeEyeShell, makeZonule } from "./geometry";
import { EyeMaterial, Selectable } from "./Selectable";

function Zonules() {
  const geometries = useMemo(
    () =>
      Array.from({ length: 20 }, (_, index) => {
        const curve = new CatmullRomCurve3(
          makeZonule((index / 20) * Math.PI * 2),
        );
        return new TubeGeometry(curve, 10, 0.018, 5, false);
      }),
    [],
  );
  return (
    <Selectable id="zonular-fibers">
      <group>
        {geometries.map((geometry, index) => (
          <mesh key={index} geometry={geometry}>
            <EyeMaterial id="zonular-fibers" color="#f1e2c8" roughness={0.7} />
          </mesh>
        ))}
      </group>
    </Selectable>
  );
}

function IrisFibers() {
  const geometries = useMemo(
    () =>
      Array.from({ length: 56 }, (_, index) => {
        const angle = (index / 56) * Math.PI * 2;
        const direction = new Vector3(Math.cos(angle), Math.sin(angle), 0);
        const curve = new CatmullRomCurve3([
          direction
            .clone()
            .multiplyScalar(0.52)
            .add(new Vector3(0, 0, 2.055)),
          direction
            .clone()
            .multiplyScalar(0.88)
            .add(new Vector3(0, 0, 2.07 + (index % 3) * 0.004)),
          direction
            .clone()
            .multiplyScalar(1.22)
            .add(new Vector3(0, 0, 2.055)),
        ]);
        return new TubeGeometry(
          curve,
          8,
          index % 4 === 0 ? 0.026 : 0.014,
          4,
          false,
        );
      }),
    [],
  );
  return (
    <group name="iris-fibers">
      <group>
        {geometries.map((geometry, index) => (
          <mesh key={index} geometry={geometry}>
            <EyeMaterial
              id="iris"
              color={index % 5 === 0 ? "#d7b96b" : "#83a267"}
              roughness={0.62}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export function EyeModel() {
  const sclera = useMemo(() => makeEyeShell(2.72, 2.82, -2.82, 0.92), []);
  const choroid = useMemo(() => makeEyeShell(2.53, 2.7, -2.58, 0.58), []);
  const retina = useMemo(() => makeEyeShell(2.43, 2.62, -2.48, 0.48), []);
  const vitreousGeometry = useMemo(() => new SphereGeometry(2.35, 64, 40), []);
  const corneaGeometry = useMemo(() => new SphereGeometry(1, 64, 40), []);
  const irisGeometry = useMemo(() => new RingGeometry(0.48, 1.28, 96), []);
  const pupilGeometry = useMemo(() => new CircleGeometry(0.48, 96), []);
  const lensGeometry = useMemo(() => new SphereGeometry(1, 48, 32), []);
  const ciliaryGeometry = useMemo(() => new RingGeometry(1.05, 1.32, 96), []);
  const aqueousGeometry = useMemo(() => new SphereGeometry(1, 48, 24), []);
  const opticNerveGeometry = useMemo(
    () =>
      new TubeGeometry(
        new CatmullRomCurve3([
          new Vector3(0, 0, -2.5),
          new Vector3(0.04, 0.02, -3.05),
          new Vector3(0.12, 0.05, -3.55),
        ]),
        24,
        0.36,
        16,
        false,
      ),
    [],
  );
  const opticDiscGeometry = useMemo(() => new CircleGeometry(0.34, 48), []);
  return (
    <group name="eye-model" rotation={[0.03, -0.07, 0]}>
      <Selectable id="sclera">
        <mesh geometry={sclera}>
          <EyeMaterial
            id="sclera"
            color="#eee9df"
            opacity={0.48}
            roughness={0.5}
          />
        </mesh>
      </Selectable>
      <Selectable id="choroid">
        <mesh geometry={choroid}>
          <EyeMaterial
            id="choroid"
            color="#744c58"
            opacity={0.9}
            roughness={0.72}
          />
        </mesh>
      </Selectable>
      <Selectable id="retina">
        <mesh geometry={retina}>
          <EyeMaterial
            id="retina"
            color="#e89470"
            opacity={0.82}
            roughness={0.52}
          />
        </mesh>
      </Selectable>
      <Selectable id="vitreous-humor">
        <mesh
          geometry={vitreousGeometry}
          scale={[0.92, 0.92, 0.94]}
          position={[0, 0, -0.18]}
        >
          <EyeMaterial
            id="vitreous-humor"
            color="#d9b39d"
            opacity={0.12}
            roughness={0.08}
            transmission={0.3}
          />
        </mesh>
      </Selectable>
      <Selectable id="cornea">
        <mesh
          geometry={corneaGeometry}
          position={[0, 0, 2.48]}
          scale={[1.42, 1.42, 0.48]}
        >
          <EyeMaterial
            id="cornea"
            color="#67dbe8"
            opacity={0.56}
            roughness={0.12}
            transmission={0.3}
          />
        </mesh>
      </Selectable>
      <Selectable id="iris">
        <mesh geometry={irisGeometry} position={[0, 0, 2.03]}>
          <EyeMaterial id="iris" color="#a8c879" roughness={0.55} />
        </mesh>
        <IrisFibers />
      </Selectable>
      <Selectable id="pupil">
        <mesh geometry={pupilGeometry} position={[0, 0, 2.045]}>
          <EyeMaterial id="pupil" color="#14242b" roughness={0.18} />
        </mesh>
      </Selectable>
      <Selectable id="ciliary-body">
        <mesh geometry={ciliaryGeometry} position={[0, 0, 0.88]}>
          <EyeMaterial id="ciliary-body" color="#d78d78" roughness={0.62} />
        </mesh>
      </Selectable>
      <Selectable id="lens">
        <mesh
          geometry={lensGeometry}
          position={[0, 0, 1.32]}
          scale={[0.82, 0.82, 0.34]}
        >
          <EyeMaterial
            id="lens"
            color="#f0c982"
            opacity={0.92}
            roughness={0.2}
            transmission={0.14}
          />
        </mesh>
      </Selectable>
      <Zonules />
      <Selectable id="aqueous-humor">
        <mesh
          geometry={aqueousGeometry}
          position={[0, 0, 1.9]}
          scale={[1.23, 1.23, 0.68]}
        >
          <EyeMaterial
            id="aqueous-humor"
            color="#4b9fe3"
            opacity={0.34}
            roughness={0.14}
            transmission={0.1}
          />
        </mesh>
      </Selectable>
      <Selectable id="optic-disc">
        <mesh
          geometry={opticDiscGeometry}
          position={[0, 0, -2.5]}
          rotation={[0, Math.PI, 0]}
        >
          <EyeMaterial id="optic-disc" color="#ee765b" roughness={0.6} />
        </mesh>
      </Selectable>
      <Selectable id="optic-nerve">
        <mesh geometry={opticNerveGeometry}>
          <EyeMaterial id="optic-nerve" color="#e8b58b" roughness={0.65} />
        </mesh>
      </Selectable>
    </group>
  );
}
