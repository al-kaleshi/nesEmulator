import { IReaderParams } from "../types/reader";
import IReadWriter from "../types/reader-writer";
import { IWriterParams } from "../types/writer";
import { MirrorMode, ROMParams } from "./types";


interface ValidateAddressRangeParams {
  address: number;
  bytes: number;
}

class ProgramROM implements IReadWriter {
  private readonly programMemory: number[];
  private readonly mapperId: number;
  private readonly mirrorMode: MirrorMode;

  constructor(params: ROMParams) {
    const { initialData } = params;
    const headerSize = 16;
    const programSize = initialData[4]! * 0x4000;
    const trainerSize = Boolean((initialData[6]! & 0x4) >> 2) ? 512 : 0;
    const isFourScreen = Boolean((initialData[6]! & 0x8) >> 3);

    this.mirrorMode = initialData[6]! & 0x1;
    if (isFourScreen) {
      this.mirrorMode = MirrorMode.FourScreen;
    }

    this.mapperId = (initialData[6]! & 0xf0) >> 4;
    this.programMemory = initialData.slice(
      headerSize + trainerSize,
      headerSize + trainerSize + programSize,
    );
  }

  private validateAddressRange(params: ValidateAddressRangeParams) {
    const { address, bytes } = params;
    if (address < 0 || address + bytes - 1 > 0x8000) {
      throw new Error(
        `[PROGRAM ROM] Address 0x${address.toString(16)} is invalid!`,
      );
    }
  }

  read(params: IReaderParams): readonly number[] {
    const { address, bytes } = params;
    this.validateAddressRange({ address, bytes });

    if (this.programMemory.length === 0x4000 && address + bytes - 1 >= 0x4000) {
      let result: number[] = [];
      for (let idx = 0; idx < bytes; idx++) {
        result.push(this.programMemory[Math.floor((address + idx) % 0x4000)]!);
      }
      return result;
    }

    return this.programMemory.slice(address, address + bytes);
  }

  write(_params: IWriterParams): void {
    throw new Error(`[CHARACTER ROM][write] not implemented!`);
  }

  getMapperId() {
    return this.mapperId;
  }

  getMirrorMode() {
    return this.mirrorMode;
  }
}

export default ProgramROM;