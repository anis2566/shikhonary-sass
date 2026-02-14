/**
 * Shared TypeScript utility types
 */

/**
 * Makes properties of T readable in IDE tooltips by expanding them.
 */
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

/**
 * Makes a set of properties required in T.
 */
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

/**
 * Deep partial implementation
 */
export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;
