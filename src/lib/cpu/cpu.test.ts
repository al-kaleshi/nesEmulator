import Bus from '../bus/bus';
import RAM from '../ram/ram';
import ProgramROM from '../rom/program-rom';
import CPU from './cpu';
import {testResults, rom} from './cpu-test-data'

describe("CPU Table Test", () => {
    const bus = new Bus({
      ram: new RAM(),
      programROM: new ProgramROM({initialData: rom})
    })

    
      const cpu = CPU.create({ bus });
    
      beforeEach(() => {
        cpu.reset();
      });

      it("nestest.nes official opcodes test", () => {
        for (const test of testResults) {
            // console.log(test);
            expect(cpu.programCounter).toEqual(test.pc);
            expect(cpu.accumulator).toEqual(test.accumulator);
            expect(cpu.x).toEqual(test.x);
            expect(cpu.y).toEqual(test.y);
            expect(cpu.stackPointer).toEqual(test.sp);
            cpu.tick();
        }
      })
})