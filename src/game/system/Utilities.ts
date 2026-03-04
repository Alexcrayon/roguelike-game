

// clamp input num between the min and max
export function clamp(num: number, min: number, max: number): number {
    if (min > max) {
        // Swap them or just return max
        return max;
    }
  return Math.min(Math.max(num, min), max);
}