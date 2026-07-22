export function hashSeed(seed: string): number {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function unit(seed: string, scope: string, attempt = 0): number {
  let value = hashSeed(`${seed}:${scope}:${attempt}`) || 1;
  value ^= value << 13; value ^= value >>> 17; value ^= value << 5;
  return (value >>> 0) / 4294967296;
}

export function pick<T>(values: readonly T[], seed: string, scope: string, attempt = 0): T {
  if (values.length === 0) throw new Error(`Cannot select from an empty collection: ${scope}`);
  return values[Math.min(values.length - 1, Math.floor(unit(seed, scope, attempt) * values.length))];
}

export function pickMany<T>(values: readonly T[], count: number, seed: string, scope: string, attempt = 0): readonly T[] {
  if (count > values.length) throw new Error(`Cannot select ${count} unique values from ${values.length}: ${scope}`);
  return [...values]
    .map((value, index) => ({ value, order: unit(seed, `${scope}:${index}`, attempt) }))
    .sort((left, right) => left.order - right.order)
    .slice(0, count)
    .map(({ value }) => value);
}

export function integerBetween(min: number, max: number, seed: string, scope: string, attempt = 0): number {
  if (max < min) throw new Error(`Invalid range for ${scope}: ${min}..${max}`);
  return min + Math.floor(unit(seed, scope, attempt) * (max - min + 1));
}

export function weightedPick<T>(values: readonly T[], weight: (value: T) => number, seed: string, scope: string, attempt = 0): T {
  const weighted = values.map(value => ({ value, weight: Math.max(0, weight(value)) }));
  const total = weighted.reduce((sum, entry) => sum + entry.weight, 0);
  if (total <= 0) return pick(values, seed, scope, attempt);
  let cursor = unit(seed, scope, attempt) * total;
  for (const entry of weighted) { cursor -= entry.weight; if (cursor <= 0) return entry.value; }
  return weighted[weighted.length - 1].value;
}
