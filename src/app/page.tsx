"use client";

import Bus from "@/lib/bus/bus";
import CPU from "@/lib/cpu/cpu";
import RAM from "@/lib/ram/ram";
import ProgramROM from "@/lib/rom/program-rom";
import { ChangeEvent, useState } from "react";

export default function Home() {
  const [cpu, setCPU] = useState<CPU>();
  const [accumulator, setAccumulator] = useState(0);
  const [pc, setPC] = useState(0);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [stackPointer, setStackPointer] = useState(0);
  const [carryFlag, setCarryFlag] = useState(false);
  const [zeroFlag, setZeroFlag] = useState(false);
  const [interruptDisableFlag, setInterruptDisableFlag] = useState(false);
  const [decimalFlag, setDecimalFlag] = useState(false);
  const [overflowFlag, setOverflowFlag] = useState(false);
  const [negativeFlag, setNegativeFlag] = useState(false);

  const update = (c?: CPU) => {
    const localCPU = c ?? cpu;
    setAccumulator(localCPU!.accumulator);
    setPC(localCPU!.programCounter);
    setX(localCPU!.x);
    setY(localCPU!.y);
    setStackPointer(localCPU!.stackPointer);
    setCarryFlag(localCPU!.carry);
    setZeroFlag(localCPU!.zero);
    setInterruptDisableFlag(localCPU!.interruptDisable);
    setDecimalFlag(localCPU!.decimal);
    setOverflowFlag(localCPU!.overflow);
    setNegativeFlag(localCPU!.negative);
  };

  const readFileAsync = (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const cpu = CPU.create({
          bus: new Bus({
            ram: new RAM(),
            programROM: new ProgramROM({
              initialData: Array.from(
                new Uint8Array(event.target!.result as ArrayBuffer)
              ),
            }),
          }),
        });
        setCPU(cpu);
        update(cpu);
        resolve(undefined);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  async function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.target;
    const selectedFiles = files as FileList;
    const file = selectedFiles?.[0];
    await readFileAsync(file);
  }

  function tick() {
    cpu!.tick();
    update();
  }

  return (
    <main className="p-4 flex justify-center items-center h-screen">
      <div className="border-2 shadow rounded-xl p-4">
        <label>Upload File</label>
        <input
          className="block w-fit text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
          id="file_input"
          type="file"
          onChange={handleChange}
        ></input>
        {cpu === undefined ? null : (
          <div className="grid gap-4 grid-cols-[max-content_max-content] text-left">
            <div>
              <h1 className="font-bold">Status Flags</h1>
              <table className="w-[300px]">
                <thead>
                  <tr>
                    <th>Flag Name</th>
                    <th>Flag Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Carry</td>
                    <td>{carryFlag ? "TRUE" : "FALSE"}</td>
                  </tr>
                  <tr>
                    <td>Zero</td>
                    <td>{zeroFlag ? "TRUE" : "FALSE"}</td>
                  </tr>
                  <tr>
                    <td>Interrupt Disable</td>
                    <td>{interruptDisableFlag ? "TRUE" : "FALSE"}</td>
                  </tr>
                  <tr>
                    <td>Decimal</td>
                    <td>{decimalFlag ? "TRUE" : "FALSE"}</td>
                  </tr>
                  <tr>
                    <td>Overflow</td>
                    <td>{overflowFlag ? "TRUE" : "FALSE"}</td>
                  </tr>
                  <tr>
                    <td>Negative</td>
                    <td>{negativeFlag ? "TRUE" : "FALSE"}</td>
                  </tr>
                </tbody>
                <div className="mt-10">
                  <span>Program Counter: </span>
                  <span>{`0x${pc.toString(16)}`}</span>
                </div>
                <button
                  type="button"
                  className="text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mt-2"
                  onClick={tick}
                >
                  Tick
                </button>
              </table>
            </div>
            <div>
              <h1 className="font-bold">Registers</h1>
              <table className="w-[300px]">
                <thead>
                  <tr>
                    <th>Register Name</th>
                    <th>Register Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Accumulator</td>
                    <td>{`0x${accumulator.toString(16)}`}</td>
                  </tr>
                  <tr>
                    <td>X</td>
                    <td>{`0x${x.toString(16)}`}</td>
                  </tr>
                  <tr>
                    <td>Y</td>
                    <td>{`0x${y.toString(16)}`}</td>
                  </tr>
                  <tr>
                    <td>Stack Pointer</td>
                    <td>{`0x${stackPointer.toString(16)}`}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
