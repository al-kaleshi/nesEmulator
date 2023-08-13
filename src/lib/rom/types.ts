const enum MirrorMode {
  Horizontal,
  Vertical,
  FourScreen,
}

interface ROMParams {
  readonly initialData: number[];
}

export type { ROMParams };
export { MirrorMode };
