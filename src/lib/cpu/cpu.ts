import IReadWriter from "../types/reader-writer";
import opCodes from "./op-codes";
import { AddressMode } from "./types";

interface CPUParams {
  readonly bus: IReadWriter;
}

interface GetOperatorAddressParams {
  readonly addressMode: AddressMode;
}

interface InstructionParams {
  readonly addressMode: AddressMode;
}

interface SetBreakParams {
  value: boolean;
  opcode: number;
}

class CPU {
  private readonly _bus: IReadWriter;
  private _accumulator: number = 0; // 8-bit
  private _x: number = 0; // 8-bit
  private _y: number = 0; // 8-bit
  private _status: number = 0; // 8-bit
  private _stackPointer: number = 0; // 8-bit
  private _programCounter: number = 0; // 16-bit

  private constructor(params: CPUParams) {
    const { bus } = params;
    this._bus = bus;
    this.reset();
  }

  private getOperatorAddress(
    params: GetOperatorAddressParams
  ): number | undefined {
    const { addressMode } = params;

    switch (addressMode) {
      case AddressMode.Implicit:
      case AddressMode.Accumulator: {
        return;
      }
      case AddressMode.Immediate:
      case AddressMode.Relative:
      case AddressMode.ZeroPage: {
        return this._programCounter++;
      }
      case AddressMode.ZeroPageX: {
        const [address] = this._bus.read({
          address: this._programCounter++,
          bytes: 1,
        });
        return (address + this._x) % 0xff;
      }
      case AddressMode.ZeroPageY: {
        const [address] = this._bus.read({
          address: this._programCounter++,
          bytes: 1,
        });
        return (address + this._y) % 0xff;
      }
      case AddressMode.Absolute: {
        const [low, high] = this._bus.read({
          address: this._programCounter,
          bytes: 2,
        });
        this._programCounter += 2;
        return (high! << 8) | low!;
      }
      case AddressMode.AbsoluteX: {
        let [low, high] = this._bus.read({
          address: this._programCounter,
          bytes: 2,
        });
        this._programCounter += 2;
        return ((high! << 8) | low!) + this._x;
      }
      case AddressMode.AbsoluteY: {
        let [low, high] = this._bus.read({
          address: this._programCounter,
          bytes: 2,
        });
        this._programCounter += 2;
        return ((high! << 8) | low!) + this._y;
      }
      case AddressMode.Indirect: {
        let [inDirectLow, inDirectHigh] = this._bus.read({
          address: this._programCounter,
          bytes: 2,
        });
        this._programCounter += 2;
        const inDirectAddress = (inDirectHigh! << 8) | inDirectLow!;
        const [low, high] = this._bus.read({
          address: inDirectAddress,
          bytes: 2,
        });
        return (high! << 8) | low!;
      }
      case AddressMode.IndexedIndirect: {
        const [offset] = this._bus.read({
          address: this._programCounter,
          bytes: 1,
        });
        this._programCounter += 1;
        const [low] = this._bus.read({
          address: (offset + this._x) % 0xff,
          bytes: 1,
        });
        const [high] = this._bus.read({
          address: (offset + this._x + 1) % 0xff,
          bytes: 1,
        });
        return (high! << 8) | low!;
      }
      case AddressMode.IndirectIndexed: {
        const [offset] = this._bus.read({
          address: this._programCounter,
          bytes: 1,
        });
        this._programCounter += 1;
        const [low] = this._bus.read({
          address: offset!,
          bytes: 1,
        });
        const [high] = this._bus.read({
          address: (offset! + 1) % 0xff,
          bytes: 1,
        });
        return ((high! << 8) | low!) + this._y;
      }
      default: {
        throw new Error(`[CPU]: Address Mode:${addressMode} does not exist`);
      }
    }
  }

  private lda(params: InstructionParams) {
    const { addressMode } = params;

    switch (addressMode) {
      case AddressMode.Immediate:
      case AddressMode.ZeroPage:
      case AddressMode.ZeroPageX:
      case AddressMode.Absolute:
      case AddressMode.AbsoluteX:
      case AddressMode.AbsoluteY:
      case AddressMode.IndexedIndirect:
      case AddressMode.IndirectIndexed: {
        const address = this.getOperatorAddress({ addressMode });
        const [value] = this._bus.read({ address: address!, bytes: 1 });

        this._accumulator = value!;
        this.zero = this._accumulator === 0x0;
        this.negative = Boolean((this._accumulator & 0x80) >> 7);
        break;
      }
      default: {
        throw new Error(`[LDA] Does not support Address Mode ${addressMode}`);
      }
    }
  }

  private clc(params: InstructionParams) {
    const { addressMode } = params;
    switch (addressMode) {
      case AddressMode.Implicit: {
        this.carry = false;
        break;
      }
      default: {
        throw new Error(`[CLC] Does not support Address Mode ${addressMode}`);
      }
    }
  }

  private cld(params: InstructionParams) {
    const { addressMode } = params;
    switch (addressMode) {
      case AddressMode.Implicit: {
        this.decimal = false;
        break;
      }
      default: {
        throw new Error(`[CLD] Does not support Address Mode ${addressMode}`);
      }
    }
  }

  private cli(params: InstructionParams) {
    const { addressMode } = params;
    switch (addressMode) {
      case AddressMode.Implicit: {
        this.interruptDisable = false;
        break;
      }
      default: {
        throw new Error(`[CLI] Does not support Address Mode ${addressMode}`);
      }
    }
  }

  private clv(params: InstructionParams) {
    const { addressMode } = params;
    switch (addressMode) {
      case AddressMode.Implicit: {
        this.overflow = false;
        break;
      }
      default: {
        throw new Error(`[CLV] Does not support Address Mode ${addressMode}`);
      }
    }
  }

  private cmp(params: InstructionParams) {
    const { addressMode } = params;

    switch (addressMode) {
      case AddressMode.Immediate:
      case AddressMode.ZeroPage:
      case AddressMode.ZeroPageX:
      case AddressMode.Absolute:
      case AddressMode.AbsoluteX:
      case AddressMode.AbsoluteY:
      case AddressMode.IndexedIndirect:
      case AddressMode.IndirectIndexed: {
        const address = this.getOperatorAddress({ addressMode });
        const [value] = this._bus.read({ address: address!, bytes: 1 });
        const result = this.accumulator - value;

        this.carry = this.accumulator >= value;
        this.zero = result === 0;
        this.negative = Boolean((result & 0x80) >> 7);
        break;
      }
      default: {
        throw new Error(`[CMP] Does not support Address Mode ${addressMode}`);
      }
    }
  }
  private asl(params: InstructionParams) {
    const { addressMode } = params;
    switch (addressMode) {
      case AddressMode.Accumulator: {
        const result = this._accumulator << 1;
        this.accumulator = result & 0xff;
        this.carry = Boolean((result & CPU.stackOffset) >> 8);
        this.zero = this._accumulator === 0;
        this.negative = Boolean((this._accumulator & 0x80) >> 7);
        break;
      }
      case AddressMode.ZeroPage:
      case AddressMode.ZeroPageX:
      case AddressMode.Absolute:
      case AddressMode.AbsoluteX: {
        const address = this.getOperatorAddress({ addressMode });
        const [value] = this._bus.read({ address: address!, bytes: 1 });
        const result = value << 1;
        this._bus.write({ address: address!, data: [result & 0xff] });
        this.carry = Boolean((result & CPU.stackOffset) >> 8);
        this.zero = (result & 0xff) === 0;
        this.negative = Boolean((result & 0xff & 0x80) >> 7);
        break;
      }
      default: {
        throw new Error(`[ASL] Does not support Address Mode ${addressMode}`);
      }
    }
  }

  // Relative displacemnt is after opcode.
  private bcc(params: InstructionParams) {
    const { addressMode } = params;
    switch (addressMode) {
      case AddressMode.Relative: {
        if (!this.carry) {
          const address = this.getOperatorAddress({ addressMode })!;
          const [relativeDisplacemet] = this._bus.read({ address, bytes: 1 });
          const result = this._programCounter + relativeDisplacemet;
          this._programCounter = result;
          break;
        }
      }
      default: {
        throw new Error(`[BCC] Does not support Address Mode ${addressMode}`);
      }
    }
  }

  private bcs(params: InstructionParams) {
    const { addressMode } = params;
    switch (addressMode) {
      case AddressMode.Relative: {
        if (this.carry) {
          const address = this.getOperatorAddress({ addressMode })!;
          const [relativeDisplacemet] = this._bus.read({ address, bytes: 1 });
          const result = this._programCounter + relativeDisplacemet;
          this._programCounter = result;
          break;
        }
      }
      default: {
        throw new Error(`[BCS] Does not support Address Mode ${addressMode}`);
      }
    }
  }

  private beq(params: InstructionParams) {
    const { addressMode } = params;
    switch (addressMode) {
      case AddressMode.Relative: {
        if (this.zero) {
          const address = this.getOperatorAddress({ addressMode })!;
          const [relativeDisplacemet] = this._bus.read({ address, bytes: 1 });
          const result = this._programCounter + relativeDisplacemet;
          this._programCounter = result;
          break;
        }
      }
      default: {
        throw new Error(`[BEQ] Does not support Address Mode ${addressMode}`);
      }
    }
  }

  private bit(params: InstructionParams) {
    const { addressMode } = params;

    switch (addressMode) {
      case AddressMode.ZeroPage:
      case AddressMode.Absolute: {
        const address = this.getOperatorAddress({ addressMode })!;
        const [value] = this._bus.read({ address: address!, bytes: 1 });
        const mask = this.accumulator & value!;
        this.zero = (mask & 0xff) === 0;
        this.negative = Boolean((value & 0xff & 0x80) >> 7);
        this.overflow = Boolean(((value & 0xff & value) >> 6) & 0x1);
        break;
      }
      default: {
        throw new Error(`[BIT] Does not support Address Mode ${addressMode}`);
      }
    }
  }

  private bmi(params: InstructionParams) {
    const { addressMode } = params;
    switch (addressMode) {
      case AddressMode.Relative: {
        if (this.negative) {
          const address = this.getOperatorAddress({ addressMode })!;
          const [relativeDisplacemet] = this._bus.read({ address, bytes: 1 });
          const result = this._programCounter + relativeDisplacemet;
          this._programCounter = result;
          break;
        }
      }
      default: {
        throw new Error(`[BMI] Does not support Address Mode ${addressMode}`);
      }
    }
  }

  private bne(params: InstructionParams) {
    const { addressMode } = params;
    switch (addressMode) {
      case AddressMode.Relative: {
        if (!this.zero) {
          const address = this.getOperatorAddress({ addressMode })!;
          const [relativeDisplacemet] = this._bus.read({ address, bytes: 1 });
          const result = this._programCounter + relativeDisplacemet;
          this._programCounter = result;
          break;
        }
      }
      default: {
        throw new Error(`[BNE] Does not support Address Mode ${addressMode}`);
      }
    }
  }

  private bpl(params: InstructionParams) {
    const { addressMode } = params;
    switch (addressMode) {
      case AddressMode.Relative: {
        if (!this.negative) {
          const address = this.getOperatorAddress({ addressMode })!;
          const [relativeDisplacemet] = this._bus.read({ address, bytes: 1 });
          const result = this._programCounter + relativeDisplacemet;
          this._programCounter = result;
          break;
        }
      }
      default: {
        throw new Error(`[BPL] Does not support Address Mode ${addressMode}`);
      }
    }
  }

  private brk(params: InstructionParams) {
    const { addressMode } = params;
    switch (addressMode) {
      case AddressMode.Implicit: {
        if (!this.interruptDisable) {
          // Push 16 bit PC onto stack
          this._bus.write({
            address: CPU.stackOffset + this._stackPointer,
            data: [(this.programCounter >> 8) & 0xff],
          });
          this._stackPointer -= 1;
          this._bus.write({
            address: CPU.stackOffset + this._stackPointer,
            data: [(this.programCounter >> 8) & 0xff],
          });
          this._stackPointer -= 1;

          // Push 8 bit status register onto stack
          this.break = { value: true, opcode: 0x00 };
          this.interruptDisable = true;
          this._bus.write({
            address: CPU.stackOffset + this._stackPointer,
            data: [this.status],
          });
          this._stackPointer -= 1;

          const [low, high] = this._bus.read({ address: 0xfffe, bytes: 2 })!;
          this._programCounter = (high << 8) | low;
        }
        break;
      }
      default: {
        throw new Error(`[BRK] Does not support Address Mode ${addressMode}`);
      }
    }
  }

  private bvc(params: InstructionParams) {
    const { addressMode } = params;
    switch (addressMode) {
      case AddressMode.Relative: {
        if (!this.overflow) {
          const address = this.getOperatorAddress({ addressMode })!;
          const [relativeDisplacemet] = this._bus.read({ address, bytes: 1 });
          const result = this._programCounter + relativeDisplacemet;
          this._programCounter = result;
          break;
        }
      }
      default: {
        throw new Error(`[BVC] Does not support Address Mode ${addressMode}`);
      }
    }
  }

  private bvs(params: InstructionParams) {
    const { addressMode } = params;
    switch (addressMode) {
      case AddressMode.Relative: {
        if (this.overflow) {
          const address = this.getOperatorAddress({ addressMode })!;
          const [relativeDisplacemet] = this._bus.read({ address, bytes: 1 });
          const result = this._programCounter + relativeDisplacemet;
          this._programCounter = result;
          break;
        }
      }
      default: {
        throw new Error(`[BVS] Does not support Address Mode ${addressMode}`);
      }
    }
  }

  private dec(params: InstructionParams) {
    const { addressMode } = params;
    switch (addressMode) {
      case AddressMode.ZeroPage:
      case AddressMode.ZeroPageX:
      case AddressMode.Absolute:
      case AddressMode.AbsoluteX: {
        const address = this.getOperatorAddress({ addressMode });
        const [value] = this._bus.read({ address: address!, bytes: 1 });
        const result = value - 1;
        this._bus.write({ address: address!, data: [result & 0xff] });
        this.zero = (result & 0xff) === 0;
        this.negative = Boolean((result & 0xff & 0x80) >> 7);
        break;
      }
      default: {
        throw new Error(`[DEC] Does not support Address Mode ${addressMode}`);
      }
    }
  }

  private dex(params: InstructionParams) {
    const { addressMode } = params;
    switch (addressMode) {
      case AddressMode.Implicit: {
        this._x -= 1;
        this.zero = (this.x & 0xff) === 0;
        this.negative = Boolean((this.x & 0xff & 0x80) >> 7);
        break;
      }
      default: {
        throw new Error(`[DEX] Does not support Address Mode ${addressMode}`);
      }
    }
  }

  private dey(params: InstructionParams) {
    const { addressMode } = params;
    switch (addressMode) {
      case AddressMode.Implicit: {
        this._y -= 1;
        this.zero = (this.y & 0xff) === 0;
        this.negative = Boolean((this.y & 0xff & 0x80) >> 7);
        break;
      }
      default: {
        throw new Error(`[DEY] Does not support Address Mode ${addressMode}`);
      }
    }
  }

  private eor(params: InstructionParams) {
    const { addressMode } = params;
    switch (addressMode) {
      case AddressMode.Immediate:
      case AddressMode.ZeroPage:
      case AddressMode.ZeroPageX:
      case AddressMode.Absolute:
      case AddressMode.AbsoluteX:
      case AddressMode.AbsoluteY:
      case AddressMode.IndexedIndirect:
      case AddressMode.IndirectIndexed: {
        const address = this.getOperatorAddress({ addressMode })!;
        const [value] = this._bus.read({ address, bytes: 1 });
        const result = this.accumulator ^ value;
        this._accumulator = result;
        this.zero = (this.accumulator & 0xff) === 0;
        this.negative = Boolean((this.accumulator & 0xff & 0x80) >> 7);
        break;
      }
      default: {
        throw new Error(`[EOR] Does not support Address Mode ${addressMode}`);
      }
    }
  }
  private inc(params: InstructionParams) {
    const { addressMode } = params;
    switch (addressMode) {
      case AddressMode.ZeroPage:
      case AddressMode.ZeroPageX:
      case AddressMode.Absolute:
      case AddressMode.AbsoluteX: {
        const address = this.getOperatorAddress({ addressMode });
        const [value] = this._bus.read({ address: address!, bytes: 1 });
        const result = value + 1;
        this._bus.write({ address: address!, data: [result & 0xff] });
        this.zero = (result & 0xff) === 0;
        this.negative = Boolean((result & 0xff & 0x80) >> 7);
        break;
      }
      default: {
        throw new Error(`[INC] Does not support Address Mode ${addressMode}`);
      }
    }
  }

  private inx(params: InstructionParams) {
    const { addressMode } = params;
    switch (addressMode) {
      case AddressMode.Implicit: {
        this._x += 1;
        this.zero = (this.x & 0xff) === 0;
        this.negative = Boolean((this.x & 0xff & 0x80) >> 7);
        break;
      }
      default: {
        throw new Error(`[INX] Does not support Address Mode ${addressMode}`);
      }
    }
  }

  private iny(params: InstructionParams) {
    const { addressMode } = params;
    switch (addressMode) {
      case AddressMode.Implicit: {
        this._y += 1;
        this.zero = (this.y & 0xff) === 0;
        this.negative = Boolean((this.y & 0xff & 0x80) >> 7);
        break;
      }
      default: {
        throw new Error(`[INY] Does not support Address Mode ${addressMode}`);
      }
    }
  }

  private jmp(params: InstructionParams) {
    const { addressMode } = params;
    switch (addressMode) {
      case AddressMode.Absolute:
      case AddressMode.Indirect: {
        const address = this.getOperatorAddress({ addressMode })!;
        this._programCounter = address;
        break;
      }
      default: {
        throw new Error(`[JMP] Does not support Address Mode ${addressMode}`);
      }
    }
  }

  private pha(params: InstructionParams) {
    const { addressMode } = params;
    switch (addressMode) {
      case AddressMode.Implicit: {
        this._bus.write({
          address: CPU.stackOffset + this._stackPointer,
          data: [this.accumulator],
        });
        this._stackPointer -= 1;
        break;
      }
      default: {
        throw new Error(`[PHA] Does not support Address Mode ${addressMode}`);
      }
    }
  }

  private jsr(params: InstructionParams) {
    const { addressMode } = params;
    switch (addressMode) {
      case AddressMode.Absolute: {
        
        this._bus.write({
          address: CPU.stackOffset + this.stackPointer,
          data: [(this.programCounter >> 8) & 0xff],
        });
        this._stackPointer -= 1;

        this._bus.write({
          address: CPU.stackOffset + this.stackPointer,
          data: [this.programCounter & 0xff],
        });
        this._stackPointer -= 1;

        const address = this.getOperatorAddress({ addressMode })!;

        this._programCounter = address;

        break;
      }
      default: {
        throw new Error(`[JSR] Does not support Address Mode ${addressMode}`);
      }
    }
  }

  private php(params: InstructionParams) {
    const { addressMode } = params;
    switch (addressMode) {
      case AddressMode.Implicit: {
        this._bus.write({
          address: CPU.stackOffset + this._stackPointer,
          data: [this.status | this.break],
        });
        this.break = { value: false, opcode: 0x8 };
        this._stackPointer -= 1;
        break;
      }
      default: {
        throw new Error(`[PHP] Does not support Address Mode ${addressMode}`);
      }
    }
  }

  private pla(params: InstructionParams) {
    const { addressMode } = params;
    switch (addressMode) {
      case AddressMode.Implicit: {
        this._stackPointer += 1;
        const [value] = this._bus.read({
          address: CPU.stackOffset + this.stackPointer,
          bytes: 1,
        });
        this._accumulator = value;
        this.zero = (this.accumulator & 0xff) === 0;
        this.negative = Boolean((this.accumulator & 0xff & 0x80) >> 7);
        break;
      }
      default: {
        throw new Error(`[PLA] Does not support Address Mode ${addressMode}`);
      }
    }
  }

  private plp(params: InstructionParams) {
    const { addressMode } = params;
    switch (addressMode) {
      case AddressMode.Implicit: {
        this._stackPointer += 1;
        const [value] = this._bus.read({
          address: CPU.stackOffset + this.stackPointer,
          bytes: 1,
        });
        this._status = value;
        break;
      }
      default: {
        throw new Error(`[PLP] Does not support Address Mode ${addressMode}`);
      }
    }
  }

  private sec(params: InstructionParams) {
    const { addressMode } = params;
    switch (addressMode) {
      case AddressMode.Implicit: {
        this.carry = true;
        break;
      }
      default: {
        throw new Error(`[SEC] Does not support Address Mode ${addressMode}`);
      }
    }
  }
  private sed(params: InstructionParams) {
    const { addressMode } = params;
    switch (addressMode) {
      case AddressMode.Implicit: {
        this.decimal = true;
        break;
      }
      default: {
        throw new Error(`[SED] Does not support Address Mode ${addressMode}`);
      }
    }
  }

  private sei(params: InstructionParams) {
    const { addressMode } = params;
    switch (addressMode) {
      case AddressMode.Implicit: {
        this.interruptDisable = true;
        break;
      }
      default: {
        throw new Error(`[SEI] Does not support Address Mode ${addressMode}`);
      }
    }
  }

  private tax(params: InstructionParams) {
    const { addressMode } = params;
    switch (addressMode) {
      case AddressMode.Implicit: {
        this._x = this.accumulator;
        this.zero = (this.x & 0xff) === 0;
        this.negative = Boolean((this.x & 0xff & 0x80) >> 7);
        break;
      }
      default: {
        throw new Error(`[TAX] Does not support Address Mode ${addressMode}`);
      }
    }
  }

  private tay(params: InstructionParams) {
    const { addressMode } = params;
    switch (addressMode) {
      case AddressMode.Implicit: {
        this._y = this.accumulator;
        this.zero = (this.y & 0xff) === 0;
        this.negative = Boolean((this.y & 0xff & 0x80) >> 7);
        break;
      }
      default: {
        throw new Error(`[TAY] Does not support Address Mode ${addressMode}`);
      }
    }
  }

  private tsx(params: InstructionParams) {
    const { addressMode } = params;
    switch (addressMode) {
      case AddressMode.Implicit: {
        this._x = this.stackPointer;
        this.zero = (this.x & 0xff) === 0;
        this.negative = Boolean((this.x & 0xff & 0x80) >> 7);
        break;
      }
      default: {
        throw new Error(`[TSX] Does not support Address Mode ${addressMode}`);
      }
    }
  }

  private txa(params: InstructionParams) {
    const { addressMode } = params;
    switch (addressMode) {
      case AddressMode.Implicit: {
        this.accumulator = this.x;
        this.zero = (this.accumulator & 0xff) === 0;
        this.negative = Boolean((this.accumulator & 0xff & 0x80) >> 7);
        break;
      }
      default: {
        throw new Error(`[TXA] Does not support Address Mode ${addressMode}`);
      }
    }
  }

  private txs(params: InstructionParams) {
    const { addressMode } = params;
    switch (addressMode) {
      case AddressMode.Implicit: {
        this.stackPointer = this.x;
        break;
      }
      default: {
        throw new Error(`[TXS] Does not support Address Mode ${addressMode}`);
      }
    }
  }

  private tya(params: InstructionParams) {
    const { addressMode } = params;
    switch (addressMode) {
      case AddressMode.Implicit: {
        this._accumulator = this.y;
        this.zero = (this.accumulator & 0xff) === 0;
        this.negative = Boolean((this.accumulator & 0xff & 0x80) >> 7);
        break;
      }
      default: {
        throw new Error(`[TYA] Does not support Address Mode ${addressMode}`);
      }
    }
  }

  private sta(params: InstructionParams) {
    const { addressMode } = params;
    switch (addressMode) {
      case AddressMode.ZeroPage:
      case AddressMode.ZeroPageX:
      case AddressMode.Absolute:
      case AddressMode.AbsoluteX:
      case AddressMode.AbsoluteY:
      case AddressMode.IndexedIndirect:
      case AddressMode.IndirectIndexed: {
        const address = this.getOperatorAddress({ addressMode })!;
        const [value] = this._bus.read({ address, bytes: 1 });
        this._bus.write({ address: value, data: [this._accumulator] });
        break;
      }
      default: {
        throw new Error(`[STA] Does not support Address Mode ${addressMode}`);
      }
    }
  }

  private stx(params: InstructionParams) {
    const { addressMode } = params;
    switch (addressMode) {
      case AddressMode.ZeroPage:
      case AddressMode.ZeroPageY:
      case AddressMode.Absolute: {
        const address = this.getOperatorAddress({ addressMode })!;
        const [value] = this._bus.read({ address, bytes: 1 });
        this._bus.write({ address: value, data: [this.x] });
        break;
      }
      default: {
        throw new Error(`[STX] Does not support Address Mode ${addressMode}`);
      }
    }
  }

  private sty(params: InstructionParams) {
    const { addressMode } = params;
    switch (addressMode) {
      case AddressMode.ZeroPage:
      case AddressMode.ZeroPageX:
      case AddressMode.Absolute: {
        const address = this.getOperatorAddress({ addressMode })!;
        const [value] = this._bus.read({ address, bytes: 1 });
        this._bus.write({ address: value, data: [this.y] });
        break;
      }
      default: {
        throw new Error(`[STY] Does not support Address Mode ${addressMode}`);
      }
    }
  }

  private ldx(params: InstructionParams) {
    const { addressMode } = params;

    switch (addressMode) {
      case AddressMode.Immediate:
      case AddressMode.ZeroPage:
      case AddressMode.ZeroPageY:
      case AddressMode.Absolute:
      case AddressMode.AbsoluteY: {
        const address = this.getOperatorAddress({ addressMode });
        const [value] = this._bus.read({ address: address!, bytes: 1 });

        this._x = value!;
        this.zero = this._x === 0x0;
        this.negative = Boolean((this._x & 0x80) >> 7);
        break;
      }
      default: {
        throw new Error(`[LDA] Does not support Address Mode ${addressMode}`);
      }
    }
  }

  private ldy(params: InstructionParams) {
    const { addressMode } = params;

    switch (addressMode) {
      case AddressMode.Immediate:
      case AddressMode.ZeroPage:
      case AddressMode.ZeroPageX:
      case AddressMode.Absolute:
      case AddressMode.AbsoluteX: {
        const address = this.getOperatorAddress({ addressMode });
        const [value] = this._bus.read({ address: address!, bytes: 1 });

        this._y = value!;
        this.zero = this._y === 0x0;
        this.negative = Boolean((this._y & 0x80) >> 7);
        break;
      }
      default: {
        throw new Error(`[LDY] Does not support Address Mode ${addressMode}`);
      }
    }
  }

  private nop(params: InstructionParams) {
    const { addressMode } = params;
    switch (addressMode) {
      case AddressMode.Implicit: {
        this._programCounter += 1;
        break;
      }
      default: {
        throw new Error(`[NOP] Does not support Address Mode ${addressMode}`);
      }
    }
  }

  private ora(params: InstructionParams) {
    const { addressMode } = params;
    switch (addressMode) {
      case AddressMode.Immediate:
      case AddressMode.ZeroPage:
      case AddressMode.ZeroPageX:
      case AddressMode.Absolute:
      case AddressMode.AbsoluteX:
      case AddressMode.AbsoluteY:
      case AddressMode.IndexedIndirect:
      case AddressMode.IndirectIndexed: {
        const address = this.getOperatorAddress({ addressMode })!;
        const [value] = this._bus.read({ address, bytes: 1 });
        const result = this.accumulator | value;
        this._accumulator = result;
        this.zero = (this.accumulator & 0xff) === 0;
        this.negative = Boolean((this.accumulator & 0xff & 0x80) >> 7);
        break;
      }
      default: {
        throw new Error(`[ORA] Does not support Address Mode ${addressMode}`);
      }
    }
  }

  private cpx(params: InstructionParams) {
    const { addressMode } = params;

    switch (addressMode) {
      case AddressMode.Immediate:
      case AddressMode.ZeroPage:
      case AddressMode.Absolute: {
        const address = this.getOperatorAddress({ addressMode });
        const [value] = this._bus.read({ address: address!, bytes: 1 });
        const result = this.x - value;

        this.carry = this.x >= value;
        this.zero = result === 0;
        this.negative = Boolean((result & 0x80) >> 7);
        break;
      }
      default: {
        throw new Error(`[CPX] Does not support Address Mode ${addressMode}`);
      }
    }
  }

  private cpy(params: InstructionParams) {
    const { addressMode } = params;

    switch (addressMode) {
      case AddressMode.Immediate:
      case AddressMode.ZeroPage:
      case AddressMode.Absolute: {
        const address = this.getOperatorAddress({ addressMode });
        const [value] = this._bus.read({ address: address!, bytes: 1 });
        const result = this.y - value;

        this.carry = this.y >= value;
        this.zero = result === 0;
        this.negative = Boolean((result & 0x80) >> 7);
        break;
      }
      default: {
        throw new Error(`[CPY] Does not support Address Mode ${addressMode}`);
      }
    }
  }

  private and(params: InstructionParams) {
    const { addressMode } = params;
    switch (addressMode) {
      case AddressMode.Immediate:
      case AddressMode.ZeroPage:
      case AddressMode.ZeroPageX:
      case AddressMode.Absolute:
      case AddressMode.AbsoluteX:
      case AddressMode.AbsoluteY:
      case AddressMode.IndexedIndirect:
      case AddressMode.IndirectIndexed: {
        const address = this.getOperatorAddress({ addressMode })!;
        const [value] = this._bus.read({ address, bytes: 1 });
        const result = this.accumulator & value;
        this._accumulator = result;
        this.zero = (this.accumulator & 0xff) === 0;
        this.negative = Boolean((this.accumulator & 0xff & 0x80) >> 7);
        break;
      }
      default: {
        throw new Error(`[AND] Does not support Address Mode ${addressMode}`);
      }
    }
  }

  private lsr(params: InstructionParams) {
    const { addressMode } = params;
    switch (addressMode) {
      case AddressMode.Accumulator: {
        this.carry = Boolean((this._accumulator & CPU.stackOffset) >> 8);
        const result = this._accumulator >> 1;
        this.accumulator = result & 0xff;
        this.zero = this._accumulator === 0;
        this.negative = Boolean((this._accumulator & 0x80) >> 7);
        break;
      }
      case AddressMode.ZeroPage:
      case AddressMode.ZeroPageX:
      case AddressMode.Absolute:
      case AddressMode.AbsoluteX: {
        const address = this.getOperatorAddress({ addressMode });
        const [value] = this._bus.read({ address: address!, bytes: 1 });
        this.carry = Boolean((value & CPU.stackOffset) >> 8);
        const result = value >> 1;
        this._bus.write({ address: address!, data: [result & 0xff] });
        this.zero = (result & 0xff) === 0;
        this.negative = Boolean((result & 0xff & 0x80) >> 7);
        break;
      }
      default: {
        throw new Error(`[LSR] Does not support Address Mode ${addressMode}`);
      }
    }
  }

  private rol(params: InstructionParams) {
    const { addressMode } = params;

    switch (addressMode) {
      case AddressMode.Accumulator: {
        this.accumulator =
          ((this.accumulator << 1) | (this.carry ? 1 : 0)) & 0xff;
        this.carry = Boolean((this.accumulator & CPU.stackOffset) >> 8);
        this.zero = (this.accumulator & 0xff) === 0;
        this.negative = Boolean((this.accumulator & 0xff & 0x80) >> 7);
        break;
      }
      case AddressMode.ZeroPage:
      case AddressMode.ZeroPageX:
      case AddressMode.Absolute:
      case AddressMode.AbsoluteX: {
        const address = this.getOperatorAddress({ addressMode })!;
        const [value] = this._bus.read({ address, bytes: 1 });
        const result = (value << 1) | (this.carry ? 1 : 0);
        this.carry = Boolean((result & CPU.stackOffset) >> 8);
        this.zero = (result & 0xff) === 0;
        this.negative = Boolean((result & 0xff & 0x80) >> 7);
        this._bus.write({ address, data: [result & 0xff] });
        break;
      }
      default: {
        throw new Error(`[ROL] Does not support Address Mode ${addressMode}`);
      }
    }
  }

  private ror(params: InstructionParams) {
    const { addressMode } = params;

    switch (addressMode) {
      case AddressMode.Accumulator: {
        this.accumulator =
          (((this.carry ? 1 : 0) << 7) | (this.accumulator >> 1)) & 0xff;
        this.carry = Boolean((this.accumulator & CPU.stackOffset) >> 8);
        this.zero = (this.accumulator & 0xff) === 0;
        this.negative = Boolean((this.accumulator & 0xff & 0x80) >> 7);
        break;
      }
      case AddressMode.ZeroPage:
      case AddressMode.ZeroPageX:
      case AddressMode.Absolute:
      case AddressMode.AbsoluteX: {
        const address = this.getOperatorAddress({ addressMode })!;
        const [value] = this._bus.read({ address, bytes: 1 });
        const result = ((this.carry ? 1 : 0) << 7) | (value >> 1);
        this._bus.write({ address, data: [result & 0xff] });
        this.carry = Boolean((value & CPU.stackOffset) >> 8);
        this.zero = (result & 0xff) === 0;
        this.negative = Boolean((result & 0xff & 0x80) >> 7);
        break;
      }
      default: {
        throw new Error(`[ROR] Does not support Address Mode ${addressMode}`);
      }
    }
  }

  private rti(params: InstructionParams) {
    const { addressMode } = params;
    switch (addressMode) {
      case AddressMode.Implicit: {
        this.stackPointer += 1;
        const [newStatus] = this._bus.read({
          address: CPU.stackOffset + this.stackPointer,
          bytes: 1,
        });
        this.status = newStatus;
        this.status &= ~this.break;
        this.stackPointer += 1;
        const [low] = this._bus.read({
          address: CPU.stackOffset + this.stackPointer,
          bytes: 1,
        });
        this.stackPointer += 1;
        const [high] = this._bus.read({
          address: CPU.stackOffset + this.stackPointer,
          bytes: 1,
        });
        this._programCounter = (high << 8) | low;
        break;
      }
      default: {
        throw new Error(`[RTI] Does not support Address Mode ${addressMode}`);
      }
    }
  }

  private rts(params: InstructionParams) {
    const { addressMode } = params;
    switch (addressMode) {
      case AddressMode.Implicit: {
        this.stackPointer += 1;
        const [low] = this._bus.read({
          address: CPU.stackOffset + this.stackPointer,
          bytes: 1,
        });
        this.stackPointer += 1;
        const [high] = this._bus.read({
          address: CPU.stackOffset + this.stackPointer,
          bytes: 1,
        });
        this._programCounter = (high << 8) | low;
        this._programCounter += 1;
        break;
      }
      default: {
        throw new Error(`[RTS] Does not support Address Mode ${addressMode}`);
      }
    }
  }

  private adc(params: InstructionParams) {
    const { addressMode } = params;
    switch (addressMode) {
      case AddressMode.Immediate:
      case AddressMode.ZeroPage:
      case AddressMode.ZeroPageX:
      case AddressMode.Absolute:
      case AddressMode.AbsoluteX:
      case AddressMode.AbsoluteY:
      case AddressMode.IndexedIndirect:
      case AddressMode.IndirectIndexed: {
        const address = this.getOperatorAddress({ addressMode })!;
        const [value] = this._bus.read({ address, bytes: 1 });
        const result = this.accumulator + value + (this.carry ? 1 : 0);
        this.carry = Boolean(result > 255);
        this.zero = (result & 0xff) === 0;
        this.overflow = Boolean(
          ~(this.accumulator ^ value) & (this.accumulator ^ result) & 0x80
        );
        this.negative = Boolean((result & 0xff & 0x80) >> 7);
        this.accumulator = result & 0xff;
        break;
      }
      default: {
        throw new Error(`[ADC] Does not support Address Mode ${addressMode}`);
      }
    }
  }

  private sbc(params: InstructionParams) {
    const { addressMode } = params;
    switch (addressMode) {
      case AddressMode.Immediate:
      case AddressMode.ZeroPage:
      case AddressMode.ZeroPageX:
      case AddressMode.Absolute:
      case AddressMode.AbsoluteX:
      case AddressMode.AbsoluteY:
      case AddressMode.IndexedIndirect:
      case AddressMode.IndirectIndexed: {
        const address = this.getOperatorAddress({ addressMode })!;
        const [value] = this._bus.read({ address, bytes: 1 });
        const invertedValue =
          this.accumulator >= value ? value * -1 : (value ^ 0xff) - 255;
        const result = this.accumulator + invertedValue + (this.carry ? 1 : 0);
        this.carry = Boolean((result & CPU.stackOffset) >> 8);
        this.zero = (result & 0xff) === 0;
        this.overflow = Boolean(
          (result ^ this._accumulator) & (result ^ invertedValue) & 0x0080
        );
        this.negative = Boolean((result & 0xff & 0x80) >> 7);
        this.accumulator = result & 0xff;
        break;
      }
      default: {
        throw new Error(`[SBC] Does not support Address Mode ${addressMode}`);
      }
    }
  }

  private irq() {
    if (!this.interruptDisable) {
      this._bus.write({address: CPU.stackOffset + this.stackPointer, data:[ (this.programCounter >> 8) & 0xFF]});
      this.stackPointer -= 1;
      this._bus.write({address: CPU.stackOffset + this.stackPointer, data:[ this.programCounter & 0xFF]});
      this.stackPointer -= 1;
      this.break = {value: false, opcode:0xDEADBEEF};
      this.interruptDisable = true;
      this._bus.write({address: CPU.stackOffset + this.stackPointer, data:[ this.status ]});
      this.stackPointer -= 1;
      const [low, high] = this._bus.read({address: 0xFE, bytes:2});
      this._programCounter = (high << 8) | low;
    }
  }


  private nmi() {
    this._bus.write({address: CPU.stackOffset + this.stackPointer, data:[ (this.programCounter >> 8) & 0xFF]});
    this.stackPointer -= 1;
    this._bus.write({address: CPU.stackOffset + this.stackPointer, data:[ this.programCounter & 0xFF]});
    this.stackPointer -= 1;

    this.break = {value: false, opcode:0xDEADBEEF};
    this.interruptDisable = true;
    this._bus.write({address: CPU.stackOffset + this.stackPointer, data:[ this.status ]});
    this.stackPointer -= 1;

    const [low] = this._bus.read({address: 0xFA, bytes:1});
    const [high] = this._bus.read({address: 0xFF, bytes:1});
    this._programCounter = (high << 8) | low;

  }

  get accumulator() {
    return this._accumulator;
  }

  set accumulator(value: number) {
    this._accumulator = value;
  }

  get x() {
    return this._x;
  }

  set x(value: number) {
    this._x = value;
  }

  get y() {
    return this._y;
  }

  set y(value: number) {
    this._y = value;
  }

  set stackPointer(value: number) {
    this._stackPointer = value;
  }

  get stackPointer() {
    return this._stackPointer;
  }

  get programCounter() {
    return this._programCounter;
  }

  get status() {
    return this._status;
  }
  set status(value: number) {
    this._status = value;
  }

  get carry() {
    return Boolean(this._status & 0x1);
  }

  set carry(value: boolean) {
    if (value) {
      this._status |= 0x1;
    } else {
      this._status &= ~0x1;
    }
  }

  get zero() {
    return Boolean((this._status & 0x2) >> 1);
  }

  set zero(value: boolean) {
    if (value) {
      this._status |= 0x2;
    } else {
      this._status &= ~0x2;
    }
  }

  get interruptDisable() {
    return Boolean((this._status & 0x4) >> 2);
  }

  set interruptDisable(value: boolean) {
    if (value) {
      this._status |= 0x4;
    } else {
      this._status &= ~0x4;
    }
  }

  get decimal() {
    return Boolean((this._status & 0x8) >> 3);
  }

  set decimal(value: boolean) {
    if (value) {
      this._status |= 0x8;
    } else {
      this._status &= ~0x8;
    }
  }

  get break(): number {
    return (this._status & 0x30) >> 4;
  }

  set break(params: SetBreakParams) {
    const { value, opcode } = params;
    switch (opcode) {
      case 0x0:
      case 0x8: {
        this._status = value ? (this._status |= 0x30) : (this._status &= 0x30);
        break;
      }
      default: {
        this._status = value ? (this._status |= 0x20) : (this._status &= 0x20);
        break;
      }
    }
  }

  get overflow() {
    return Boolean((this._status & 0x40) >> 6);
  }

  set overflow(value: boolean) {
    if (value) {
      this._status |= 0x40;
    } else {
      this._status &= ~0x40;
    }
  }

  get negative() {
    return Boolean((this._status & 0x80) >> 7);
  }

  set negative(value: boolean) {
    if (value) {
      this._status |= 0x80;
    } else {
      this._status &= ~0x80;
    }
  }

  public reset() {
    this._accumulator = 0;
    this._x = 0;
    this._y = 0;
    this._status = 0;
    this._stackPointer = 0xfd;
    this._programCounter = 0xC000;
  }

  tick(): void {
    const [opCode] = this._bus.read({
      address: this._programCounter,
      bytes: 1,
    });
    

    console.log(`PC: 0x${this.programCounter.toString(16)}`);
    console.log(`OPCODE: ${opCode.toString(16)}`);
    console.log(`ACC: 0x${this.accumulator.toString(16)}`);
    console.log(`SP: 0x${this.stackPointer.toString(16)}`);
    console.log(`X: 0x${this.x.toString(16)}`);
    console.log(`Y: 0x${this.y.toString(16)}`);

    this._programCounter += 1;

    switch (opCode) {
      case 0xa9: {
        this.lda({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0xa5: {
        this.lda({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0xb5: {
        this.lda({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0xad: {
        this.lda({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0xbd: {
        this.lda({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0xb9: {
        this.lda({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0xa1: {
        this.lda({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0xb1: {
        this.lda({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x18: {
        this.clc({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0xd8: {
        this.cld({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x58: {
        this.cli({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0xb8: {
        this.clv({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0xc9: {
        this.cmp({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0xc5: {
        this.cmp({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0xd5: {
        this.cmp({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0xcd: {
        this.cmp({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0xdd: {
        this.cmp({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0xd9: {
        this.cmp({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0xc1: {
        this.cmp({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0xd1: {
        this.cmp({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x0a: {
        this.asl({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x06: {
        this.asl({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x16: {
        this.asl({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x0e: {
        this.asl({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x1e: {
        this.asl({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x90: {
        this.bcc({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0xb0: {
        this.bcs({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0xf0: {
        this.beq({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x24: {
        this.bit({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x2c: {
        this.bit({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x30: {
        this.bmi({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0xd0: {
        this.bne({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x10: {
        this.bpl({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x0: {
        this.brk({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x50: {
        this.bvc({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x70: {
        this.bvs({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0xc6: {
        this.dec({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0xd6: {
        this.dec({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0xce: {
        this.dec({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0xde: {
        this.dec({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0xca: {
        this.dex({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x88: {
        this.dey({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x49: {
        this.eor({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x45: {
        this.eor({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x55: {
        this.eor({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x4d: {
        this.eor({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x5d: {
        this.eor({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x59: {
        this.eor({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x41: {
        this.eor({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x51: {
        this.eor({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0xe6: {
        this.inc({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0xf6: {
        this.inc({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0xee: {
        this.inc({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0xfe: {
        this.inc({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0xe8: {
        this.inx({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0xc8: {
        this.iny({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x4c: {
        this.jmp({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x6c: {
        this.jmp({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x48: {
        this.pha({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x20: {
        this.jsr({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x08: {
        this.php({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x68: {
        this.pla({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x28: {
        this.plp({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x38: {
        this.sec({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0xf8: {
        this.sed({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x78: {
        this.sei({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0xaa: {
        this.tax({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0xa8: {
        this.tay({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0xba: {
        this.tsx({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x8a: {
        this.txa({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x9a: {
        this.txs({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x98: {
        this.tya({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x85: {
        this.sta({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x95: {
        this.sta({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x8d: {
        this.sta({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x9d: {
        this.sta({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x99: {
        this.sta({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x81: {
        this.sta({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x91: {
        this.sta({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x86: {
        this.stx({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x96: {
        this.stx({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x8e: {
        this.stx({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x84: {
        this.sty({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x94: {
        this.sty({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x8c: {
        this.sty({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0xa2: {
        this.ldx({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0xa6: {
        this.ldx({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0xb6: {
        this.ldx({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0xae: {
        this.ldx({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0xbe: {
        this.ldx({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0xa0: {
        this.ldy({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0xa4: {
        this.ldy({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0xb4: {
        this.ldy({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0xac: {
        this.ldy({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0xbc: {
        this.ldy({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0xea: {
        this.nop({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x09: {
        this.ora({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x05: {
        this.ora({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x15: {
        this.ora({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x0d: {
        this.ora({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x1d: {
        this.ora({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x19: {
        this.ora({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x01: {
        this.ora({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x11: {
        this.ora({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0xe0: {
        this.cpx({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0xe4: {
        this.cpx({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0xec: {
        this.cpx({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0xc0: {
        this.cpy({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0xc4: {
        this.cpy({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0xcc: {
        this.cpy({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x29: {
        this.and({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x25: {
        this.and({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x35: {
        this.and({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x2d: {
        this.and({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x3d: {
        this.and({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x39: {
        this.and({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x21: {
        this.and({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x31: {
        this.and({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x4a: {
        this.lsr({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x46: {
        this.lsr({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x56: {
        this.lsr({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x4e: {
        this.lsr({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x5e: {
        this.lsr({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x2a: {
        this.rol({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x26: {
        this.rol({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x36: {
        this.rol({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x2e: {
        this.rol({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x3e: {
        this.rol({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x6a: {
        this.ror({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x66: {
        this.ror({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x76: {
        this.ror({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x6e: {
        this.ror({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x7e: {
        this.ror({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x40: {
        this.rti({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x60: {
        this.rts({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x69: {
        this.adc({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x65: {
        this.adc({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x75: {
        this.adc({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x6d: {
        this.adc({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x7d: {
        this.adc({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x79: {
        this.adc({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x61: {
        this.adc({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0x71: {
        this.adc({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0xe9: {
        this.sbc({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0xe5: {
        this.sbc({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0xf5: {
        this.sbc({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0xed: {
        this.sbc({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0xfd: {
        this.sbc({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0xf9: {
        this.sbc({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0xe1: {
        this.sbc({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      case 0xf1: {
        this.sbc({ addressMode: opCodes[opCode]!.addressMode });
        break;
      }
      default: {
        throw new Error(`OpCode ${opCode} does not exist!`);
      }
    }
  }

  private static stackOffset = 0x100;

  public static create(params: CPUParams) {
    return new CPU(params);
  }
}

export default CPU;
