import IReader from "./reader";
import IWriter from "./writer";

interface IReadWriter extends IReader, IWriter {}

export default IReadWriter;