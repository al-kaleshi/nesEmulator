import { IReaderParams } from "../types/reader";
import IReadWriter from "../types/reader-writer";
import { IWriterParams } from "../types/writer";

interface BusParams {
  readonly ram: IReadWriter;
  readonly programROM: IReadWriter;
}

class Bus implements IReadWriter {
  private readonly ram: IReadWriter;
  private readonly programROM: IReadWriter;

  constructor(params: BusParams) {
    const { ram, programROM } = params;
    this.ram = ram;
    this.programROM = programROM;
  }

  read(params: IReaderParams): readonly number[] {
    const { address, bytes } = params;
    if (address >= 0x0 && address + bytes - 1 <= 0x1fff) {
      return this.ram.read({ address, bytes });
    }

    if (address >= 0x8000 && address + bytes - 1 <= 0xffff) {
      return this.programROM.read({ address: address - 0x8000, bytes });
    }

    throw new Error(
      `[Bus][read]: Address 0x${address.toString(16)} is not valid`,
    );
  }

  write(params: IWriterParams): void {
    const { address, data } = params;

    if (address >= 0x0 && address + data.length - 1 <= 0x1fff) {
      return this.ram.write({ address, data });
    }

    if (address >= 0x8000 && address + data.length - 1 <= 0xffff) {
      return this.programROM.write({ address: address - 0x8000, data });
    }

    throw new Error(
      `[Bus][write]: Address 0x${address.toString(16)} is not valid`,
    );
  }
}

export default Bus;