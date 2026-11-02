// The NestVote hero swarm: one silhouette per traveler profile, then the nest.
// nomad → laptop, volunteer → lotus (growth), luxury → cocktail glass,
// expat → house, and finally the NestVote mark (a nest with a checkmark).

import {
  TAU,
  buildShapeSet,
  onBoxEdges,
  onBoxFaces,
  onCircleXZ,
  onDiscXZ,
  onRectOutlineXZ,
  onRectXY,
  onRoundRectXY,
  onSegment,
  onSphere,
  rotateX,
  rotateY,
  type Part,
  type Rand,
  type ShapeSet,
  type ShapeSpec,
  type Vec3,
} from "./geometry";
import { LOTUS, VILLA } from "./shapes";

/* Laptop: a thin base with a keyboard, and a screen leaning back. */
const LAPTOP: ShapeSpec = {
  parts: () => {
    const base: [Vec3, Vec3] = [[-1, -0.06, -0.62], [1, 0.0, 0.62]];
    const screen = (r: Rand, inner: boolean): Vec3 => {
      const p: Vec3 = inner ? onRectXY(r, -0.9, 0.9, 0.08, 1.18, 0) : onRoundRectXY(r, -0.98, 0.98, 0, 1.26, 0.06, 0);
      const tilted = rotateX(p, -0.32);
      return [tilted[0], tilted[1], tilted[2] - 0.62];
    };
    const parts: Part[] = [
      { weight: 10, at: (r) => onBoxEdges(r, ...base) },
      { weight: 6, at: (r) => onBoxFaces(r, ...base) },
      { weight: 12, at: (r) => screen(r, false) },
      { weight: 9, at: (r) => screen(r, true) },
      // Trackpad.
      { weight: 2, at: (r) => onRectOutlineXZ(r, -0.22, 0.22, 0.14, 0.48, 0.001) },
    ];
    // Keyboard rows.
    for (const z of [-0.42, -0.3, -0.18, -0.06]) {
      parts.push({ weight: 1.6, at: (r) => onSegment(r, [-0.82, 0.001, z], [0.82, 0.001, z], 0.02) });
    }
    return parts;
  },
  pose: (p) => rotateX(rotateY(p, -0.55), 0.22),
};

/* Cocktail glass: cone bowl, thin stem, foot, and an olive on a pick. */
const COCKTAIL: ShapeSpec = {
  parts: () => {
    const cone = (r: Rand): Vec3 => {
      const a = r() * TAU;
      const t = Math.sqrt(r());
      const rad = 0.9 * t;
      return [Math.cos(a) * rad, 0.05 + 0.85 * t, Math.sin(a) * rad];
    };
    return [
      { weight: 14, at: cone },
      { weight: 5, at: (r) => onCircleXZ(r, 0.9, 0.9) },
      // Liquid surface.
      { weight: 5, at: (r) => onDiscXZ(r, 0.62, 0.6) },
      { weight: 3, at: (r) => onCircleXZ(r, 0.62, 0.6) },
      { weight: 5, at: (r) => onSegment(r, [0, 0.05, 0], [0, -0.85, 0], 0.07) },
      { weight: 5, at: (r) => onDiscXZ(r, -0.85, 0.55) },
      { weight: 3, at: (r) => onCircleXZ(r, -0.85, 0.55) },
      // Olive and pick.
      { weight: 2.5, at: (r) => onSphere(r, [0.18, 0.5, 0], 0.11) },
      { weight: 1.2, at: (r) => onSegment(r, [-0.35, 1.15, 0], [0.3, 0.42, 0], 0.02) },
    ];
  },
  pose: (p) => rotateX(rotateY(p, 0.3), 0.12),
};

/* The NestVote mark: a woven bowl with a checkmark rising out of it. */
const NEST: ShapeSpec = {
  parts: () => {
    const bowl = (r: Rand): Vec3 => {
      const p = onSphere(r, [0, 0, 0], 1);
      return [p[0], -Math.abs(p[1]) * 0.75, p[2]];
    };
    const parts: Part[] = [
      { weight: 10, at: bowl },
      { weight: 6, at: (r) => onCircleXZ(r, 0, 1) },
      { weight: 4, at: (r) => onCircleXZ(r, -0.3, 0.86) },
      { weight: 3, at: (r) => onCircleXZ(r, -0.55, 0.6) },
      // Eggs resting inside.
      { weight: 2.5, at: (r) => onSphere(r, [-0.25, -0.2, 0.05], 0.2) },
      { weight: 2.5, at: (r) => onSphere(r, [0.2, -0.22, -0.1], 0.2) },
      // Checkmark.
      { weight: 7, at: (r) => onSegment(r, [-0.62, 0.35, 0], [-0.12, -0.15, 0], 0.14) },
      { weight: 11, at: (r) => onSegment(r, [-0.12, -0.15, 0], [0.85, 1.15, 0], 0.14) },
    ];
    // Loose straws poking out of the rim.
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * TAU + 0.2;
      const from: Vec3 = [Math.cos(a) * 0.95, 0, Math.sin(a) * 0.95];
      const to: Vec3 = [Math.cos(a + 0.35) * 1.22, 0.14 + (i % 3) * 0.05, Math.sin(a + 0.35) * 1.22];
      parts.push({ weight: 0.7, at: (r) => onSegment(r, from, to, 0.02) });
    }
    return parts;
  },
  pose: (p) => rotateX(rotateY(p, -0.25), 0.42),
};

export const SHAPE_KEYS = ["nomad", "volunteer", "luxury", "expat", "nest"] as const;
export type ShapeKey = (typeof SHAPE_KEYS)[number];

const SPECS: Record<ShapeKey, ShapeSpec> = {
  nomad: LAPTOP,
  volunteer: LOTUS,
  luxury: COCKTAIL,
  expat: VILLA,
  nest: NEST,
};

export function shapeIndex(key: string): number {
  const i = (SHAPE_KEYS as readonly string[]).indexOf(key);
  return i < 0 ? SHAPE_KEYS.indexOf("nest") : i;
}

export function buildShapes(count: number): ShapeSet {
  return buildShapeSet(
    SHAPE_KEYS.map((key) => SPECS[key]),
    count,
  );
}

