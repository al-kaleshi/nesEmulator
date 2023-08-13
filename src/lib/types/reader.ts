interface IReaderParams {
  address: number;
  bytes: number;
}

interface IReader {
  read(params: IReaderParams): readonly number[];
}

export default IReader;
export type { IReaderParams };
