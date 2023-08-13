interface Instruction {
  name: string;
  addressMode: AddressMode;
  bytes: number;
  cycles: number;
}

enum AddressMode {
  Implicit,
  Accumulator,
  Immediate,
  ZeroPage,
  ZeroPageX,
  ZeroPageY,
  Relative,
  Absolute,
  AbsoluteX,
  AbsoluteY,
  Indirect,
  IndexedIndirect,
  IndirectIndexed,
}

export { AddressMode };
export type { Instruction };
