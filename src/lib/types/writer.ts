interface IWriterParams {
  address: number;
  data: number[];
}

interface IWriter {
  write(params: IWriterParams): void;
}

export default IWriter;
export type { IWriterParams };
