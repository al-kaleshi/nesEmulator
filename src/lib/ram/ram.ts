import { IReaderParams } from "../types/reader";
import IReadWriter from "../types/reader-writer";
import { IWriterParams } from "../types/writer";


interface CheckAddressRangeParams {
  readonly address: number;
  readonly bytes: number;
}

class RAM implements IReadWriter {
  readonly bank: Uint8Array;
  readonly bankSize: number;

  constructor() {
    this.bankSize = 0x800;
    this.bank = new Uint8Array(this.bankSize);
  }

  private checkAddressRange(params: CheckAddressRangeParams) {
    const { address, bytes } = params;

    if (address < 0x0 || address + bytes - 1 > 0x2000) {
      throw new Error(
        `[RAM]: Address '0x${
          address.toString(16).toUpperCase
        }' is out of range!`,
      );
    }
  }

  read(params: IReaderParams): number[] {
    const { address, bytes } = params;
    this.checkAddressRange({ address, bytes });

    let result: number[] = [];

    for (let idx = 0; idx < bytes; idx++) {
      result.push(this.bank[Math.floor((address + idx) % this.bankSize)]!);
    }

    return result;
  }

  write(params: IWriterParams): void {
    const { address, data } = params;
    this.checkAddressRange({ address, bytes: data.length });

    for (let idx = 0; idx < data.length; idx++) {
      this.bank[Math.floor((address + idx) % this.bankSize)] = data[idx]!;
    }
  }
}

export default RAM;