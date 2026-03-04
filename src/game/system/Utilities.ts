

// clamp input num between the min and max
export function clamp(num: number, min: number, max: number): number {
    if (min > max) {
        // Swap them or just return max
        return max;
    }
  return Math.min(Math.max(num, min), max);
}

//testing a seedable rng 
export function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}