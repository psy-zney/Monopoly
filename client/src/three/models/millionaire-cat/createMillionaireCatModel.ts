import * as THREE from 'three';

export type CatMood = 'idle' | 'positive' | 'negative';

export interface MillionaireCatRig {
  root: THREE.Group;
  headPivot: THREE.Group;
  coinArmPivot: THREE.Group;
  tailPivot: THREE.Group;
  leftEarPivot: THREE.Group;
  rightEarPivot: THREE.Group;
}

const addMesh = (
  parent: THREE.Object3D,
  name: string,
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
  position: [number, number, number],
  scale: [number, number, number] = [1, 1, 1],
  rotation: [number, number, number] = [0, 0, 0],
) => {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.scale.set(...scale);
  mesh.rotation.set(...rotation);
  parent.add(mesh);
  return mesh;
};

const vinyl = (color: THREE.ColorRepresentation, roughness = 0.58) =>
  new THREE.MeshStandardMaterial({ color, roughness, metalness: 0, flatShading: false });

const makeArc = (width: number, depth: number) =>
  new THREE.TubeGeometry(
    new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-width / 2, 0, 0),
      new THREE.Vector3(0, -depth, 0),
      new THREE.Vector3(width / 2, 0, 0),
    ),
    12,
    0.035,
    6,
    false,
  );

export function createMillionaireCatModel(accentColor: THREE.ColorRepresentation): MillionaireCatRig {
  const root = new THREE.Group();
  root.name = 'millionaire-cat-root';

  const orange = vinyl('#f79a22', 0.6);
  const stripe = vinyl('#d66523', 0.64);
  const cream = vinyl('#f7ddb0', 0.67);
  const pink = vinyl('#ed7d70', 0.5);
  const dark = vinyl('#241512', 0.7);
  const eye = vinyl('#18130f', 0.35);
  const vest = vinyl(accentColor, 0.48);
  const gold = new THREE.MeshStandardMaterial({ color: '#f6b92c', roughness: 0.22, metalness: 0.86 });
  const white = vinyl('#fff7df', 0.48);

  const sphere = new THREE.SphereGeometry(0.5, 18, 12);
  const capsule = new THREE.CapsuleGeometry(0.24, 0.45, 6, 12);

  const bodyPivot = new THREE.Group();
  bodyPivot.name = 'body-pivot';
  root.add(bodyPivot);
  addMesh(bodyPivot, 'torso', sphere, orange, [0, -0.34, 0], [1.18, 1.05, 0.82]);
  addMesh(bodyPivot, 'belly', sphere, cream, [0, -0.45, 0.53], [0.52, 0.54, 0.18]);

  const vestShape = new THREE.Shape();
  vestShape.moveTo(-0.6, 0.2);
  vestShape.lineTo(-0.12, 0.04);
  vestShape.lineTo(0, -0.18);
  vestShape.lineTo(0.12, 0.04);
  vestShape.lineTo(0.6, 0.2);
  vestShape.lineTo(0.55, -0.52);
  vestShape.lineTo(0, -0.68);
  vestShape.lineTo(-0.55, -0.52);
  vestShape.closePath();
  const vestGeometry = new THREE.ExtrudeGeometry(vestShape, {
    depth: 0.09,
    bevelEnabled: true,
    bevelSize: 0.035,
    bevelThickness: 0.025,
    bevelSegments: 2,
  });
  vestGeometry.center();
  addMesh(bodyPivot, 'vest', vestGeometry, vest, [0, -0.28, 0.68], [0.94, 0.94, 0.94]);
  addMesh(bodyPivot, 'vest-button-top', sphere, gold, [0, -0.31, 0.79], [0.095, 0.095, 0.055]);
  addMesh(bodyPivot, 'vest-button-bottom', sphere, gold, [0, -0.49, 0.76], [0.095, 0.095, 0.055]);

  const bowPivot = new THREE.Group();
  bowPivot.name = 'bow-tie-pivot';
  bowPivot.position.set(0, 0.08, 0.77);
  bodyPivot.add(bowPivot);
  addMesh(bowPivot, 'bow-left', sphere, gold, [-0.18, 0, 0], [0.34, 0.2, 0.12], [0, 0, 0.18]);
  addMesh(bowPivot, 'bow-right', sphere, gold, [0.18, 0, 0], [0.34, 0.2, 0.12], [0, 0, -0.18]);
  addMesh(bowPivot, 'bow-knot', sphere, gold, [0, 0, 0.06], [0.16, 0.18, 0.12]);

  const headPivot = new THREE.Group();
  headPivot.name = 'head-pivot';
  headPivot.position.set(0, 0.66, 0.03);
  root.add(headPivot);
  addMesh(headPivot, 'head', sphere, orange, [0, 0, 0], [1.34, 1.06, 0.9]);

  const leftEarPivot = new THREE.Group();
  leftEarPivot.name = 'left-ear-pivot';
  leftEarPivot.position.set(-0.55, 0.68, -0.05);
  headPivot.add(leftEarPivot);
  addMesh(leftEarPivot, 'left-ear', new THREE.ConeGeometry(0.42, 0.78, 3), orange, [0, 0.05, 0], [1, 1, 0.54], [0, 0, -0.08]);
  addMesh(leftEarPivot, 'left-ear-inner', new THREE.ConeGeometry(0.27, 0.56, 3), pink, [0, 0.03, 0.18], [1, 1, 0.38], [0, 0, -0.08]);

  const rightEarPivot = new THREE.Group();
  rightEarPivot.name = 'right-ear-pivot';
  rightEarPivot.position.set(0.55, 0.68, -0.05);
  headPivot.add(rightEarPivot);
  addMesh(rightEarPivot, 'right-ear', new THREE.ConeGeometry(0.42, 0.78, 3), orange, [0, 0.05, 0], [1, 1, 0.54], [0, 0, 0.08]);
  addMesh(rightEarPivot, 'right-ear-inner', new THREE.ConeGeometry(0.27, 0.56, 3), pink, [0, 0.03, 0.18], [1, 1, 0.38], [0, 0, 0.08]);

  addMesh(headPivot, 'muzzle-left', sphere, cream, [-0.25, -0.12, 0.73], [0.57, 0.38, 0.22]);
  addMesh(headPivot, 'muzzle-right', sphere, cream, [0.25, -0.12, 0.73], [0.57, 0.38, 0.22]);
  addMesh(headPivot, 'nose', sphere, pink, [0, 0.04, 0.92], [0.18, 0.13, 0.1]);
  addMesh(headPivot, 'mouth-cavity', sphere, dark, [0, -0.34, 0.75], [0.38, 0.35, 0.16]);
  addMesh(headPivot, 'tongue', sphere, pink, [0, -0.42, 0.88], [0.22, 0.14, 0.07]);
  addMesh(headPivot, 'tooth-left', new THREE.ConeGeometry(0.07, 0.18, 8), white, [-0.18, -0.18, 0.91], [1, 1, 0.7], [0, 0, Math.PI]);
  addMesh(headPivot, 'tooth-right', new THREE.ConeGeometry(0.07, 0.18, 8), white, [0.18, -0.18, 0.91], [1, 1, 0.7], [0, 0, Math.PI]);
  addMesh(headPivot, 'eye-left', makeArc(0.34, 0.13), eye, [-0.35, 0.19, 0.84]);
  addMesh(headPivot, 'eye-right', makeArc(0.34, 0.13), eye, [0.35, 0.19, 0.84]);
  addMesh(headPivot, 'brow-left', sphere, cream, [-0.35, 0.43, 0.8], [0.24, 0.07, 0.06], [0, 0, -0.08]);
  addMesh(headPivot, 'brow-right', sphere, cream, [0.35, 0.43, 0.8], [0.24, 0.07, 0.06], [0, 0, 0.08]);
  [-0.34, 0, 0.34].forEach((x, index) => {
    addMesh(headPivot, `forehead-stripe-${index + 1}`, sphere, stripe, [x, 0.58 - Math.abs(x) * 0.15, 0.75], [0.12, 0.31, 0.06], [0, 0, x * -0.4]);
  });

  const coinArmPivot = new THREE.Group();
  coinArmPivot.name = 'coin-arm-pivot';
  coinArmPivot.position.set(-0.72, -0.05, 0.02);
  coinArmPivot.rotation.z = -0.64;
  root.add(coinArmPivot);
  addMesh(coinArmPivot, 'coin-arm', capsule, orange, [0, 0.35, 0], [0.9, 1.05, 0.9]);
  addMesh(coinArmPivot, 'coin-paw', sphere, cream, [0, 0.77, 0.12], [0.38, 0.38, 0.3]);
  const coin = addMesh(coinArmPivot, 'gold-coin', new THREE.CylinderGeometry(0.3, 0.3, 0.08, 28), gold, [0, 1.08, 0.08], [1, 1, 1], [Math.PI / 2, 0, 0]);
  addMesh(coin, 'coin-rim', new THREE.TorusGeometry(0.23, 0.025, 8, 24), gold, [0, 0.05, 0], [1, 1, 1], [Math.PI / 2, 0, 0]);

  const restArmPivot = new THREE.Group();
  restArmPivot.name = 'rest-arm-pivot';
  restArmPivot.position.set(0.72, -0.12, 0.08);
  restArmPivot.rotation.z = 0.55;
  root.add(restArmPivot);
  addMesh(restArmPivot, 'rest-arm', capsule, orange, [0, 0.2, 0], [0.86, 0.85, 0.86]);
  addMesh(restArmPivot, 'rest-paw', sphere, cream, [0, 0.58, 0.18], [0.39, 0.39, 0.31]);

  const feetPivot = new THREE.Group();
  feetPivot.name = 'feet-pivot';
  root.add(feetPivot);
  [-0.57, 0.57].forEach((x, side) => {
    addMesh(feetPivot, `foot-${side}`, sphere, orange, [x, -0.95, 0.16], [0.66, 0.44, 0.52]);
    addMesh(feetPivot, `foot-pad-${side}`, sphere, cream, [x, -0.95, 0.52], [0.47, 0.36, 0.12]);
    addMesh(feetPivot, `main-bean-${side}`, sphere, pink, [x, -1.01, 0.65], [0.17, 0.14, 0.045]);
    [-0.17, 0, 0.17].forEach((dx, toe) => {
      addMesh(feetPivot, `toe-bean-${side}-${toe}`, sphere, pink, [x + dx, -0.84, 0.64], [0.08, 0.09, 0.04]);
    });
  });

  const tailPivot = new THREE.Group();
  tailPivot.name = 'tail-pivot';
  tailPivot.position.set(0.66, -0.55, -0.2);
  root.add(tailPivot);
  const tailCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0.55, -0.18, 0),
    new THREE.Vector3(0.78, 0.2, 0),
    new THREE.Vector3(0.72, 0.72, 0),
    new THREE.Vector3(0.45, 0.98, 0),
  ]);
  addMesh(tailPivot, 'curled-tail', new THREE.TubeGeometry(tailCurve, 28, 0.18, 10, false), orange, [0, 0, 0]);
  [0.18, 0.36, 0.55, 0.72].forEach((t, index) => {
    const point = tailCurve.getPoint(t);
    addMesh(tailPivot, `tail-ring-${index + 1}`, new THREE.TorusGeometry(0.185, 0.045, 6, 16), stripe, [point.x, point.y, point.z], [1, 1, 1], [Math.PI / 2, 0, t * 0.7]);
  });
  const tailTip = tailCurve.getPoint(0.98);
  addMesh(tailPivot, 'tail-tip', sphere, cream, [tailTip.x, tailTip.y, tailTip.z], [0.38, 0.46, 0.38]);

  const faceSocket = new THREE.Object3D();
  faceSocket.name = 'face-effect-socket';
  faceSocket.position.set(0, 0.05, 1);
  headPivot.add(faceSocket);

  const coinSocket = new THREE.Object3D();
  coinSocket.name = 'coin-effect-socket';
  coinSocket.position.set(0, 1.12, 0.2);
  coinArmPivot.add(coinSocket);

  root.userData.sculptRuntime = {
    nodes: { bodyPivot, headPivot, coinArmPivot, tailPivot, leftEarPivot, rightEarPivot },
    sockets: { face: faceSocket, coin: coinSocket },
    colliders: [
      { id: 'body', type: 'sphere', center: [0, -0.25, 0], radius: 0.85 },
      { id: 'head', type: 'sphere', center: [0, 0.66, 0], radius: 0.82 },
    ],
    reconstruction: {
      source: 'millionaire-cat-reference.png',
      fidelity: 'stylized-single-view',
      inferredRegions: ['rear head', 'rear vest', 'tail root'],
    },
  };

  return { root, headPivot, coinArmPivot, tailPivot, leftEarPivot, rightEarPivot };
}

export function disposeMillionaireCatModel(root: THREE.Object3D) {
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  root.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    geometries.add(object.geometry);
    const meshMaterials = Array.isArray(object.material) ? object.material : [object.material];
    meshMaterials.forEach((material) => materials.add(material));
  });
  geometries.forEach((geometry) => geometry.dispose());
  materials.forEach((material) => material.dispose());
}
