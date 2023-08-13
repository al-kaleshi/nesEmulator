import { IReaderParams } from "../types/reader";
import IReadWriter from "../types/reader-writer";
import { IWriterParams } from "../types/writer";
import { MirrorMode, ROMParams } from "./types";


interface ValidateAddressRangeParams {
  address: number;
  bytes: number;
}

class CharacterROM implements IReadWriter {
  private readonly characterMemory: number[];
  private readonly mapperId: number;
  private readonly mirrorMode: MirrorMode;

  constructor(params: ROMParams) {
    const { initialData } = params;

    const headerSize = 16;
    const programSize = initialData[4]! * 0x4000;
    const characterSize = initialData[5]! * 0x2000;
    const trainerSize = Boolean((initialData[6]! & 0x4) >> 2) ? 512 : 0;
    const isFourScreen = Boolean((initialData[6]! & 0x8) >> 3);

    this.mirrorMode = initialData[6]! & 0x1;
    if (isFourScreen) {
      this.mirrorMode = MirrorMode.FourScreen;
    }

    this.mapperId = (initialData[6]! & 0xf0) >> 4;

    this.characterMemory = initialData.slice(
      headerSize + trainerSize + programSize,
      headerSize + trainerSize + programSize + characterSize,
    );
  }

  private validateAddressRange(params: ValidateAddressRangeParams) {
    const { address, bytes } = params;
    if (address < 0 || address + bytes - 1 > this.characterMemory.length) {
      throw new Error(
        `[CHARACTER ROM] Address 0x${address.toString(16)} is invalid!`,
      );
    }
  }

  getMapperId() {
    return this.mapperId;
  }

  getMirrorMode() {
    return this.mirrorMode;
  }

  read(params: IReaderParams): readonly number[] {
    const { address, bytes } = params;
    this.validateAddressRange({ address, bytes });
    return this.characterMemory.slice(address, address + bytes);
  }

  write(_params: IWriterParams): void {
    throw new Error(`[CHARACTER ROM][write] not implemented!`);
  }
}

export default CharacterROM;