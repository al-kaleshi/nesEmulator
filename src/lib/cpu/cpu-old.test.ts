import { cp } from "fs";
import CPU from "./cpu";

describe("CPU", () => {
  const bus = {
    read: jest.fn(),
    write: jest.fn(),
  };
  const cpu = CPU.create({ bus });

  beforeEach(() => {
    cpu.reset();
  });

  describe("Status Register", () => {
    it("first bit of status register should be set when carry is true", () => {
      cpu.carry = true;
      expect(cpu.status).toBe(0x1);
    });
    it("second bit of status register should be set when zero is true", () => {
      cpu.zero = true;
      expect(cpu.status).toBe(0x2);
    });
    it("third bit of status register should be set when interupt disable is true", () => {
      cpu.interruptDisable = true;
      expect(cpu.status).toBe(0x4);
    });
    it("fourth bit of status register should be set when decimal is true", () => {
      cpu.decimal = true;
      expect(cpu.status).toBe(0x8);
    });

    // describe("fifth and sixth bits of status register", () => {
    //   it("PHP Instruction, Bit 5 = 1 | Bit 6 = 1", () => {
    //     cpu.break = { value: true, opcode: 0x8 };
    //     expect(cpu.status).toBe(0x30);
    //   });
    //   it("BRK Instruction, Bit 5 = 1 | Bit 6 = 1", () => {
    //     cpu.break = { value: true, opcode: 0x00 };
    //     expect(cpu.status).toBe(0x30);
    //   });
    //   it("IRQ Instruction, Bit 5 = 1 | Bit 6 = 0", () => {
    //     cpu.break = { value: true, opcode: 0xDEADBEEF };
    //     expect(cpu.status).toBe(0x20);
    //   });
    //   it("NMI Instruction, Bit 5 = 1 | Bit 6 = 0", () => {
    //     cpu.break = { value: true, opcode: 0xDEADBEEF };
    //     expect(cpu.status).toBe(0x20);
    //   });
    // });

    it("seventh bit of status register should be set when overflow is true", () => {
      cpu.overflow = true;
      expect(cpu.status).toBe(0x40);
    });
    it("eighth bit of status register should be set when negative is true", () => {
      cpu.negative = true;
      expect(cpu.status).toBe(0x80);
    });
  });

//   describe("LDA", () => {
//     it("Immediate Addressing Mode", () => {
//       // Read Opcode
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffc);
//         expect(bytes).toBe(0x1);
//         return [0xa9];
//       });
//       // Read Immediate value
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffd);
//         expect(bytes).toBe(0x1);
//         return [0x5];
//       });
//       cpu.tick();
//       expect(cpu.accumulator).toBe(0x5);
//     });
//     it("Zero Page Addressing Mode", () => {
//       // Read Opcode
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffc);
//         expect(bytes).toBe(0x1);
//         return [0xa5];
//       });
//       // Read Zero Page Address
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffd);
//         expect(bytes).toBe(0x1);
//         return [0x10];
//       });
//       cpu.tick();
//       expect(cpu.accumulator).toBe(0x10);
//     });
//     it("Zero Page X Addressing Mode", () => {
//       cpu.x = 0x20;
//       // Read Opcode
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffc);
//         expect(bytes).toBe(0x1);
//         return [0xb5];
//       });
//       // Read Zero Page Address
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffd);
//         expect(bytes).toBe(0x1);
//         return [0x10];
//       });
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0x10 + cpu.x);
//         expect(bytes).toBe(0x1);
//         return [0x30];
//       });
//       cpu.tick();
//       expect(cpu.accumulator).toBe(0x30);
//     });
//     it("Absolute Addressing Mode", () => {
//       // Read Opcode
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffc);
//         expect(bytes).toBe(0x1);
//         return [0xad];
//       });

//       // Read Absolute Address
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffd);
//         expect(bytes).toBe(0x2);
//         return [0x0, 0x1];
//       });

//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0x100);
//         expect(bytes).toBe(0x1);
//         return [0x23];
//       });

//       cpu.tick();
//       expect(cpu.accumulator).toBe(0x23);
//     });
//     it("Absolute X Addressing Mode", () => {
//       cpu.x = 0x5;
//       // Read Opcode
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffc);
//         expect(bytes).toBe(0x1);
//         return [0xbd];
//       });

//       // Read Absolute Address
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffd);
//         expect(bytes).toBe(0x2);
//         return [0x0, 0x1];
//       });

//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0x100 + cpu.x);
//         expect(bytes).toBe(0x1);
//         return [0x23];
//       });

//       cpu.tick();
//       expect(cpu.accumulator).toBe(0x23);
//     });
//     it("Absolute Y Addressing Mode", () => {
//       cpu.y = 0x5;
//       // Read Opcode
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffc);
//         expect(bytes).toBe(0x1);
//         return [0xb9];
//       });

//       // Read Absolute Address
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffd);
//         expect(bytes).toBe(0x2);
//         return [0x0, 0x1];
//       });

//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0x105);
//         expect(bytes).toBe(0x1);
//         return [0x23];
//       });

//       cpu.tick();
//       expect(cpu.accumulator).toBe(0x23);
//     });
//     it("Indexed Indirect Addressing Mode", () => {
//       cpu.x = 0x4;
//       // Read Opcode
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffc);
//         expect(bytes).toBe(0x1);
//         return [0xa1];
//       });

//       // Read Argument
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffd);
//         expect(bytes).toBe(0x1);
//         return [0x24];
//       });

//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0x24 + cpu.x);
//         expect(bytes).toBe(0x1);
//         return [0x74];
//       });

//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0x24 + cpu.x + 1);
//         expect(bytes).toBe(0x1);
//         return [0x20];
//       });
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0x2074);
//         expect(bytes).toBe(0x1);
//         return [0x40];
//       });

//       cpu.tick();
//       expect(cpu.accumulator).toBe(0x40);
//     });
//     it("Indirect Indexed Addressing Mode", () => {
//       cpu.y = 0x10;
//       // Read Opcode
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffc);
//         expect(bytes).toBe(0x1);
//         return [0xb1];
//       });

//       // Read Argument
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffd);
//         expect(bytes).toBe(0x1);
//         return [0x86];
//       });

//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0x86);
//         expect(bytes).toBe(0x1);
//         return [0x28];
//       });

//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0x86 + 0x1);
//         expect(bytes).toBe(0x1);
//         return [0x40];
//       });
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0x4028 + 0x10);
//         expect(bytes).toBe(0x1);
//         return [0x40];
//       });

//       cpu.tick();
//       expect(cpu.accumulator).toBe(0x40);
//     });
//     it("Negative Flag Set", () => {
//       // Read Opcode
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffc);
//         expect(bytes).toBe(0x1);
//         return [0xa9];
//       });
//       // Read Immediate value
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffd);
//         expect(bytes).toBe(0x1);
//         return [0xff];
//       });
//       cpu.tick();
//       expect(cpu.accumulator).toBe(0xff);
//       expect(cpu.negative).toBe(true);
//       expect(cpu.zero).toBe(false);
//     });
//     it("Zero Flag Set", () => {
//       // Read Opcode
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffc);
//         expect(bytes).toBe(0x1);
//         return [0xa9];
//       });
//       // Read Immediate value
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffd);
//         expect(bytes).toBe(0x1);
//         return [0x0];
//       });
//       cpu.tick();
//       expect(cpu.accumulator).toBe(0x0);
//       expect(cpu.negative).toBe(false);
//       expect(cpu.zero).toBe(true);
//     });
//   });

//   describe("CLC", () => {
//     it("Implicit Addressing Mode", () => {
//       cpu.carry = true;
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffc);
//         expect(bytes).toBe(0x1);
//         return [0x18];
//       });
//       cpu.tick();
//       expect(cpu.carry).toBe(false);
//     });
//   });

//   describe("CLD", () => {
//     it("Implicit Addressing Mode", () => {
//       cpu.decimal = true;
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffc);
//         expect(bytes).toBe(0x1);
//         return [0xd8];
//       });
//       cpu.tick();
//       expect(cpu.decimal).toBe(false);
//     });
//   });

//   describe("CLI", () => {
//     it("Implicit Addressing Mode", () => {
//       cpu.interruptDisable = true;
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffc);
//         expect(bytes).toBe(0x1);
//         return [0x58];
//       });
//       cpu.tick();
//       expect(cpu.interruptDisable).toBe(false);
//     });
//   });

//   describe("CLV", () => {
//     it("Implicit Addressing Mode", () => {
//       cpu.overflow = true;
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffc);
//         expect(bytes).toBe(0x1);
//         return [0xb8];
//       });
//       cpu.tick();
//       expect(cpu.overflow).toBe(false);
//     });
//   });

//   describe("CMP", () => {
//     describe("Immediate Addressing Mode", () => {
//       it("Should Be Equal", () => {
//         cpu.accumulator = 0x20;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xc9];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });
//         cpu.tick();
//         expect(cpu.zero).toBeTruthy();
//         expect(cpu.carry).toBeTruthy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Greater Than", () => {
//         cpu.accumulator = 0x20;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xc9];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x10];
//         });
//         cpu.tick();
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeTruthy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Less Than", () => {
//         cpu.accumulator = 0x10;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xc9];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });
//         cpu.tick();
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeTruthy();
//       });
//     });

//     describe("Zero Page Addressing Mode", () => {
//       it("Should Be Equal", () => {
//         cpu.accumulator = 0x20;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xc5];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });
//         cpu.tick();
//         expect(cpu.zero).toBeTruthy();
//         expect(cpu.carry).toBeTruthy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should be greater than", () => {
//         cpu.accumulator = 0x20;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xc5];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x10];
//         });
//         cpu.tick();
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeTruthy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Less Than", () => {
//         cpu.accumulator = 0x10;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xc5];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });
//         cpu.tick();
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeTruthy();
//       });
//     });

//     describe("Zero Page X Addressing Mode", () => {
//       it("Should Be Equal", () => {
//         cpu.accumulator = 0x20;
//         cpu.x = 0x1;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xd5];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x20 + cpu.x);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });

//         cpu.tick();
//         expect(cpu.zero).toBeTruthy();
//         expect(cpu.carry).toBeTruthy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should be greater than", () => {
//         cpu.accumulator = 0x20;
//         cpu.x = 1;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xd5];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x10 + cpu.x);
//           expect(bytes).toBe(0x1);
//           return [0x10];
//         });
//         cpu.tick();
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeTruthy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Less Than", () => {
//         cpu.accumulator = 0x10;
//         cpu.x = 0x1;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xd5];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x20 + cpu.x);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });
//         cpu.tick();
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeTruthy();
//       });
//     });

//     describe("Absolute Addressing Mode", () => {
//       it("Should Be Equal", () => {
//         cpu.accumulator = 0x20;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xcd];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });
//         cpu.tick();
//         expect(cpu.zero).toBeTruthy();
//         expect(cpu.carry).toBeTruthy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should be greater than", () => {
//         cpu.accumulator = 0x20;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xcd];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x10);
//           expect(bytes).toBe(0x1);
//           return [0x10];
//         });
//         cpu.tick();
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeTruthy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Less Than", () => {
//         cpu.accumulator = 0x10;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xcd];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x20);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });
//         cpu.tick();
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeTruthy();
//       });
//     });

//     describe("Absolute X Addressing Mode", () => {
//       it("Should Be Equal", () => {
//         cpu.accumulator = 0x20;
//         cpu.x = 0x1;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xdd];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020 + cpu.x);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });
//         cpu.tick();
//         expect(cpu.zero).toBeTruthy();
//         expect(cpu.carry).toBeTruthy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should be greater than", () => {
//         cpu.accumulator = 0x20;
//         cpu.x = 0x1;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xdd];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x10 + cpu.x);
//           expect(bytes).toBe(0x1);
//           return [0x10];
//         });
//         cpu.tick();
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeTruthy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Less Than", () => {
//         cpu.accumulator = 0x10;
//         cpu.x = 0x1;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xdd];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x20 + cpu.x);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });
//         cpu.tick();
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeTruthy();
//       });
//     });

//     describe("Absolute Y Addressing Mode", () => {
//       it("Should Be Equal", () => {
//         cpu.accumulator = 0x20;
//         cpu.y = 0x1;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xd9];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });

//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020 + cpu.y);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });
//         cpu.tick();
//         expect(cpu.zero).toBeTruthy();
//         expect(cpu.carry).toBeTruthy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should be greater than", () => {
//         cpu.accumulator = 0x20;
//         cpu.y = 0x1;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xd9];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020 + cpu.y);
//           expect(bytes).toBe(0x1);
//           return [0x10];
//         });
//         cpu.tick();
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeTruthy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Less Than", () => {
//         cpu.accumulator = 0x10;
//         cpu.y = 0x1;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xd9];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020 + cpu.y);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });
//         cpu.tick();
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeTruthy();
//       });
//     });

//     describe("Indexed Indirect Addressing Mode", () => {
//       it("Should Be Equal", () => {
//         cpu.accumulator = 0x20;
//         cpu.x = 0x1;

//         // Read Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xc1];
//         });

//         // Offset
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });

//         // Low
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe((0x20 + cpu.x) % 0xff);
//           expect(bytes).toBe(0x1);
//           return [0x30];
//         });

//         // High
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe((0x20 + cpu.x + 1) % 0xff);
//           expect(bytes).toBe(0x1);
//           return [0x40];
//         });

//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x4030);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });
//         cpu.tick();
//         expect(cpu.zero).toBeTruthy();
//         expect(cpu.carry).toBeTruthy();
//         expect(cpu.negative).toBeFalsy();
//       });

//       it("Should be greater than", () => {
//         cpu.accumulator = 0x20;
//         cpu.x = 0x1;

//         // Read Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xc1];
//         });

//         // Offset
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });

//         // Low
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe((0x20 + cpu.x) % 0xff);
//           expect(bytes).toBe(0x1);
//           return [0x30];
//         });

//         // High
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe((0x20 + cpu.x + 1) % 0xff);
//           expect(bytes).toBe(0x1);
//           return [0x40];
//         });

//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x4030);
//           expect(bytes).toBe(0x1);
//           return [0x10];
//         });
//         cpu.tick();
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeTruthy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Less Than", () => {
//         cpu.accumulator = 0x10;
//         cpu.x = 0x1;

//         // Read Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xc1];
//         });

//         // Offset
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });

//         // Low
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe((0x20 + cpu.x) % 0xff);
//           expect(bytes).toBe(0x1);
//           return [0x30];
//         });

//         // High
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe((0x20 + cpu.x + 1) % 0xff);
//           expect(bytes).toBe(0x1);
//           return [0x40];
//         });

//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x4030);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });
//         cpu.tick();
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeTruthy();
//       });
//     });

//     describe("Indirect Indexed Addressing Mode", () => {
//       it("Should Be Equal", () => {
//         cpu.accumulator = 0x20;
//         cpu.y = 0x1;

//         // Read Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xd1];
//         });

//         // Offset
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });

//         // Low
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x20);
//           expect(bytes).toBe(0x1);
//           return [0x30];
//         });

//         // High
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe((0x20 + 1) % 0xff);
//           expect(bytes).toBe(0x1);
//           return [0x40];
//         });

//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x4030 + cpu.y);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });
//         cpu.tick();
//         expect(cpu.zero).toBeTruthy();
//         expect(cpu.carry).toBeTruthy();
//         expect(cpu.negative).toBeFalsy();
//       });

//       it("Should be greater than", () => {
//         cpu.accumulator = 0x20;
//         cpu.y = 0x1;

//         // Read Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xd1];
//         });

//         // Offset
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });

//         // Low
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x20);
//           expect(bytes).toBe(0x1);
//           return [0x30];
//         });

//         // High
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe((0x20 + 1) % 0xff);
//           expect(bytes).toBe(0x1);
//           return [0x40];
//         });

//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x4030 + cpu.y);
//           expect(bytes).toBe(0x1);
//           return [0x10];
//         });
//         cpu.tick();
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeTruthy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Less Than", () => {
//         cpu.accumulator = 0x10;
//         cpu.y = 0x1;

//         // Read Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xd1];
//         });

//         // Offset
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });

//         // Low
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x20);
//           expect(bytes).toBe(0x1);
//           return [0x30];
//         });

//         // High
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe((0x20 + 1) % 0xff);
//           expect(bytes).toBe(0x1);
//           return [0x40];
//         });

//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x4030 + cpu.y);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });
//         cpu.tick();
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeTruthy();
//       });
//     });
//   });

//   describe("ASL", () => {
//     describe("Accumulator Addressing Mode", () => {
//       it("Should Carry", () => {
//         cpu.accumulator = 0xff;

//         // Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xa];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0xfe);
//         expect(cpu.carry).toBeTruthy();
//         expect(cpu.negative).toBeTruthy();
//         expect(cpu.zero).toBeFalsy();
//       });
//       it("Should Not Carry", () => {
//         cpu.accumulator = 0x1;

//         // Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xa];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x2);
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//         expect(cpu.zero).toBeFalsy();
//       });
//       it("Should Be Negative", () => {
//         cpu.accumulator = 0xff;
//         // Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xa];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0xfe);
//         expect(cpu.carry).toBeTruthy();
//         expect(cpu.negative).toBeTruthy();
//         expect(cpu.zero).toBeFalsy();
//       });
//       it("Should Be Zero", () => {
//         cpu.accumulator = 0x80;
//         // Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xa];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x0);
//         expect(cpu.carry).toBeTruthy();
//         expect(cpu.negative).toBeFalsy();
//         expect(cpu.zero).toBeTruthy();
//       });
//     });

//     describe("Zero Page Addressing Mode", () => {
//       it("Should Carry", () => {
//         // Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x6];
//         });

//         // Value
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0xff];
//         });

//         cpu.tick();

//         expect(cpu.carry).toBeTruthy();
//         expect(cpu.negative).toBeTruthy();
//         expect(cpu.zero).toBeFalsy();
//       });
//       it("Should Not Carry", () => {
//         // Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x6];
//         });
//         // Value
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x1];
//         });

//         cpu.tick();

//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//         expect(cpu.zero).toBeFalsy();
//       });
//       it("Should Be Negative", () => {
//         // Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x6];
//         });
//         // Value
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0xff];
//         });
//         cpu.tick();

//         expect(cpu.carry).toBeTruthy();
//         expect(cpu.negative).toBeTruthy();
//         expect(cpu.zero).toBeFalsy();
//       });
//       it("Should Be Zero", () => {
//         // Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x6];
//         });
//         // Value
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x80];
//         });
//         cpu.tick();

//         expect(cpu.carry).toBeTruthy();
//         expect(cpu.negative).toBeFalsy();
//         expect(cpu.zero).toBeTruthy();
//       });
//     });

//     describe("Zero Page X Addressing Mode", () => {
//       it("Should Carry", () => {
//         cpu.x = 1;
//         // Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x16];
//         });

//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });

//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x20 + cpu.x);
//           expect(bytes).toBe(0x1);
//           return [0xff];
//         });

//         cpu.tick();
//         expect(cpu.carry).toBeTruthy();
//         expect(cpu.negative).toBeTruthy();
//         expect(cpu.zero).toBeFalsy();
//       });
//       it("Should Not Carry", () => {
//         cpu.x = 1;
//         // Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x16];
//         });

//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });

//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x20 + cpu.x);
//           expect(bytes).toBe(0x1);
//           return [0x1];
//         });

//         cpu.tick();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//         expect(cpu.zero).toBeFalsy();
//       });
//       it("Should Be Negative", () => {
//         cpu.x = 1;
//         // Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x16];
//         });

//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });

//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x20 + cpu.x);
//           expect(bytes).toBe(0x1);
//           return [0xff];
//         });

//         cpu.tick();
//         expect(cpu.carry).toBeTruthy();
//         expect(cpu.negative).toBeTruthy();
//         expect(cpu.zero).toBeFalsy();
//       });
//       it("Should Be Zero", () => {
//         cpu.x = 1;
//         // Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x16];
//         });

//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });

//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x20 + cpu.x);
//           expect(bytes).toBe(0x1);
//           return [0x80];
//         });

//         cpu.tick();
//         expect(cpu.carry).toBeTruthy();
//         expect(cpu.negative).toBeFalsy();
//         expect(cpu.zero).toBeTruthy();
//       });
//     });

//     describe("Absolute Addressing Mode", () => {
//       it("Should Carry", () => {
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x0e];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020);
//           expect(bytes).toBe(0x1);
//           return [0xff];
//         });

//         cpu.tick();
//         expect(cpu.carry).toBeTruthy();
//         expect(cpu.negative).toBeTruthy();
//         expect(cpu.zero).toBeFalsy();
//       });
//       it("Should Not Carry", () => {
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x0e];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020);
//           expect(bytes).toBe(0x1);
//           return [0x1];
//         });

//         cpu.tick();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//         expect(cpu.zero).toBeFalsy();
//       });
//       it("Should Be Negative", () => {
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x0e];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020);
//           expect(bytes).toBe(0x1);
//           return [0xff];
//         });

//         cpu.tick();
//         expect(cpu.carry).toBeTruthy();
//         expect(cpu.negative).toBeTruthy();
//         expect(cpu.zero).toBeFalsy();
//       });
//       it("Should Be Zero", () => {
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x0e];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020);
//           expect(bytes).toBe(0x1);
//           return [0x80];
//         });

//         cpu.tick();
//         expect(cpu.carry).toBeTruthy();
//         expect(cpu.negative).toBeFalsy();
//         expect(cpu.zero).toBeTruthy();
//       });
//     });

//     describe("Absolute X Addressing Mode", () => {
//       it("Should Carry", () => {
//         cpu.x = 0x1;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x1e];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020 + cpu.x);
//           expect(bytes).toBe(0x1);
//           return [0xff];
//         });
//         cpu.tick();
//         expect(cpu.carry).toBeTruthy();
//         expect(cpu.negative).toBeTruthy();
//         expect(cpu.zero).toBeFalsy();
//       });
//       it("Should Not Carry", () => {
//         cpu.x = 0x1;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x1e];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020 + cpu.x);
//           expect(bytes).toBe(0x1);
//           return [0x1];
//         });
//         cpu.tick();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//         expect(cpu.zero).toBeFalsy();
//       });
//       it("Should Be Negative", () => {
//         cpu.x = 0x1;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x1e];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020 + cpu.x);
//           expect(bytes).toBe(0x1);
//           return [0xff];
//         });
//         cpu.tick();
//         expect(cpu.carry).toBeTruthy();
//         expect(cpu.negative).toBeTruthy();
//         expect(cpu.zero).toBeFalsy();
//       });
//       it("Should Be Zero", () => {
//         cpu.x = 0x1;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x1e];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020 + cpu.x);
//           expect(bytes).toBe(0x1);
//           return [0x80];
//         });
//         cpu.tick();
//         expect(cpu.carry).toBeTruthy();
//         expect(cpu.negative).toBeFalsy();
//         expect(cpu.zero).toBeTruthy();
//       });
//     });
//   });

//   describe("BCC", () => {
//     describe("Relative Addressing Mode", () => {
//       it("Flag is clear", () => {
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x90];
//         });
//         // Relative Displacement
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x10];
//         });
//         cpu.tick();
//         expect(cpu.programCounter).toBe(0xffe + 0x10);
//         expect(cpu.carry).toBeFalsy();
//       });
//     });
//   });

//   describe("BCS", () => {
//     describe("Relative Addressing Mode", () => {
//       it("Flag is set", () => {
//         cpu.carry = true;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xb0];
//         });
//         // Relative Displacement
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });
//         cpu.tick();
//         expect(cpu.programCounter).toBe(0xffe + 0x20);
//         expect(cpu.carry).toBeTruthy();
//       });
//     });
//   });

//   describe("BEQ", () => {
//     describe("Relative Addressing Mode", () => {
//       it("Flag is set", () => {
//         cpu.zero = true;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xf0];
//         });
//         // Relative Displacement
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x30];
//         });
//         cpu.tick();
//         expect(cpu.programCounter).toBe(0xffe + 0x30);
//         expect(cpu.zero).toBeTruthy();
//       });
//     });
//   });

//   describe("BIT", () => {
//     describe("Zero Page Addressing Mode", () => {
//       it("Negative bit is set", () => {
//         cpu.accumulator = 0x80;
//         // Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x24];
//         });
//         // Value
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x80];
//         });
//         cpu.tick();

//         expect(cpu.overflow).toBeFalsy();
//         expect(cpu.negative).toBeTruthy();
//         expect(cpu.zero).toBeFalsy();
//       });
//       it("Overflow bit is set", () => {
//         cpu.accumulator = 0x40;
//         // Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x24];
//         });
//         // Value
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x40];
//         });
//         cpu.tick();

//         expect(cpu.overflow).toBeTruthy();
//         expect(cpu.negative).toBeFalsy();
//         expect(cpu.zero).toBeFalsy();
//       });
//     });
//     describe("Absolute Addressing Mode", () => {
//       it("Negative bit is set", () => {
//         cpu.accumulator = 0x80;
//         // Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x2c];
//         });

//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         // Value
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020);
//           expect(bytes).toBe(0x1);
//           return [0x80];
//         });

//         cpu.tick();

//         expect(cpu.overflow).toBeFalsy();
//         expect(cpu.negative).toBeTruthy();
//         expect(cpu.zero).toBeFalsy();
//       });
//       it("Overflow bit is set", () => {
//         cpu.accumulator = 0x40;
//         // Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x2c];
//         });

//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         // Value
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020);
//           expect(bytes).toBe(0x1);
//           return [0x40];
//         });

//         cpu.tick();

//         expect(cpu.overflow).toBeTruthy();
//         expect(cpu.negative).toBeFalsy();
//         expect(cpu.zero).toBeFalsy();
//       });
//     });
//   });

//   describe("BMI", () => {
//     describe("Relative Addressing Mode", () => {
//       it("Flag is clear", () => {
//         cpu.negative = true;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x30];
//         });
//         // Relative Displacement
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x10];
//         });
//         cpu.tick();
//         expect(cpu.programCounter).toBe(0xffe + 0x10);
//         expect(cpu.negative).toBeTruthy();
//       });
//     });
//   });

//   describe("BNE", () => {
//     describe("Relative Addressing Mode", () => {
//       it("Flag is clear", () => {
//         cpu.zero = false;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xd0];
//         });
//         // Relative Displacement
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x70];
//         });
//         cpu.tick();
//         expect(cpu.programCounter).toBe(0xffe + 0x70);
//         expect(cpu.zero).toBeFalsy();
//       });
//     });
//   });

//   describe("BPL", () => {
//     describe("Relative Addressing Mode", () => {
//       it("Flag is clear", () => {
//         cpu.negative = false;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xd0];
//         });
//         // Relative Displacement
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x12];
//         });
//         cpu.tick();
//         expect(cpu.programCounter).toBe(0xffe + 0x12);
//         expect(cpu.zero).toBeFalsy();
//       });
//     });
//   });

//   describe("BRK", () => {
//     describe("Relative Addressing Mode", () => {
//       it("Forces the generation of an interrupt request while program counter and processor status are pushed on the stack", () => {
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x0];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xfffe);
//           expect(address + 1).toBe(0xffff);
//           expect(bytes).toBe(0x2);
//           return [0x10, 0x20];
//         });
//         cpu.tick();
//         expect(cpu.programCounter).toBe(0x2010);
//         expect(cpu.break).toBe(0x3);
//       });
//     });
//   });

//   describe("BVC", () => {
//     describe("Relative Addressing Mode", () => {
//       it("Flag is clear", () => {
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x50];
//         });
//         // Relative Displacement
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x70];
//         });
//         cpu.tick();
//         expect(cpu.programCounter).toBe(0xffe + 0x70);
//         expect(cpu.overflow).toBeFalsy();
//       });
//     });
//   });

//   describe("BVS", () => {
//     describe("Relative Addressing Mode", () => {
//       it("Flag is set", () => {
//         cpu.overflow = true;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x70];
//         });
//         // Relative Displacement
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x70];
//         });
//         cpu.tick();
//         expect(cpu.programCounter).toBe(0xffe + 0x70);
//         expect(cpu.overflow).toBeTruthy();
//       });
//     });
//   });

//   describe("DEC", () => {
//     describe("Zero Page Addressing Mode", () => {
//       it("Should Be Positive", () => {
//         // Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xc6];
//         });
//         // Valueå
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x2];
//         });

//         cpu.tick();

//         expect(cpu.negative).toBeFalsy();
//         expect(cpu.zero).toBeFalsy();
//       });
//       it("Should Be Negative", () => {
//         // Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xc6];
//         });
//         // Value
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0xff];
//         });
//         cpu.tick();

//         expect(cpu.negative).toBeTruthy();
//         expect(cpu.zero).toBeFalsy();
//       });
//       it("Should Be Zero", () => {
//         // Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xc6];
//         });
//         // Value
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x1];
//         });
//         cpu.tick();
//         expect(cpu.negative).toBeFalsy();
//         expect(cpu.zero).toBeTruthy();
//       });
//     });

//     describe("Zero Page X Addressing Mode", () => {
//       it("Should Be Positive", () => {
//         cpu.x = 1;
//         // Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xd6];
//         });

//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });

//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x20 + cpu.x);
//           expect(bytes).toBe(0x1);
//           return [0x2];
//         });
//         cpu.tick();
//         expect(cpu.negative).toBeFalsy();
//         expect(cpu.zero).toBeFalsy();
//       });
//       it("Should Be Negative", () => {
//         cpu.x = 1;
//         // Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xd6];
//         });

//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });

//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x20 + cpu.x);
//           expect(bytes).toBe(0x1);
//           return [0xff];
//         });

//         cpu.tick();

//         expect(cpu.negative).toBeTruthy();
//         expect(cpu.zero).toBeFalsy();
//       });
//       it("Should Be Zero", () => {
//         cpu.x = 1;
//         // Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xd6];
//         });

//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });

//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x20 + cpu.x);
//           expect(bytes).toBe(0x1);
//           return [0x1];
//         });
//         cpu.tick();
//         expect(cpu.negative).toBeFalsy();
//         expect(cpu.zero).toBeTruthy();
//       });
//     });

//     describe("Absolute Addressing Mode", () => {
//       it("Should Be Postive", () => {
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xce];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020);
//           expect(bytes).toBe(0x1);
//           return [0x2];
//         });
//         cpu.tick();
//         expect(cpu.negative).toBeFalsy();
//         expect(cpu.zero).toBeFalsy();
//       });
//       it("Should Be Negative", () => {
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xce];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020);
//           expect(bytes).toBe(0x1);
//           return [0xff];
//         });
//         cpu.tick();

//         expect(cpu.negative).toBeTruthy();
//         expect(cpu.zero).toBeFalsy();
//       });
//       it("Should Be Zero", () => {
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xce];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020);
//           expect(bytes).toBe(0x1);
//           return [0x1];
//         });
//         cpu.tick();
//         expect(cpu.negative).toBeFalsy();
//         expect(cpu.zero).toBeTruthy();
//       });
//     });

//     describe("Absolute X Addressing Mode", () => {
//       it("Should Be Positive", () => {
//         cpu.x = 0x1;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xde];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020 + cpu.x);
//           expect(bytes).toBe(0x1);
//           return [0x2];
//         });
//         cpu.tick();
//         expect(cpu.negative).toBeFalsy();
//         expect(cpu.zero).toBeFalsy();
//       });
//       it("Should Be Negative", () => {
//         cpu.x = 0x1;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xde];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020 + cpu.x);
//           expect(bytes).toBe(0x1);
//           return [0xff];
//         });
//         cpu.tick();
//         expect(cpu.negative).toBeTruthy();
//         expect(cpu.zero).toBeFalsy();
//       });
//       it("Should Be Zero", () => {
//         cpu.x = 0x1;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xde];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020 + cpu.x);
//           expect(bytes).toBe(0x1);
//           return [0x1];
//         });
//         cpu.tick();
//         expect(cpu.negative).toBeFalsy();
//         expect(cpu.zero).toBeTruthy();
//       });
//     });
//   });

//   describe("DEX", () => {
//     describe("Implied Addressing Mode", () => {
//       it("Should Be Positive", () => {
//         cpu.x = 2;
//         // Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xca];
//         });
//         cpu.tick();
//         expect(cpu.x).toBe(0x1);
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Negative", () => {
//         cpu.x = 0;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xca];
//         });
//         cpu.tick();
//         expect(cpu.x).toBe(-1);
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.negative).toBeTruthy();
//       });
//       it("Should Be Zero", () => {
//         cpu.x = 1;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xca];
//         });
//         cpu.tick();
//         expect(cpu.x).toBe(0x0);
//         expect(cpu.zero).toBeTruthy();
//         expect(cpu.negative).toBeFalsy();
//       });
//     });
//   });

//   describe("DEY", () => {
//     describe("Implied Addressing Mode", () => {
//       it("Should Be Positive", () => {
//         cpu.y = 2;
//         // Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x88];
//         });
//         cpu.tick();
//         expect(cpu.y).toBe(0x1);
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Negative", () => {
//         cpu.y = 0;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x88];
//         });
//         cpu.tick();
//         expect(cpu.y).toBe(-1);
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.negative).toBeTruthy();
//       });
//       it("Should Be Zero", () => {
//         cpu.y = 1;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x88];
//         });
//         cpu.tick();
//         expect(cpu.y).toBe(0x0);
//         expect(cpu.zero).toBeTruthy();
//         expect(cpu.negative).toBeFalsy();
//       });
//     });
//   });

//   describe("EOR", () => {
//     describe("Immediate Addressing Mode", () => {
//       it("Should Be Zero", () => {
//         cpu.accumulator = 0x20;
//         // Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x49];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x0);
//         expect(cpu.zero).toBeTruthy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Positive", () => {
//         cpu.accumulator = 0x1;
//         // Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x49];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x3];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x2);
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Negative", () => {
//         cpu.accumulator = 0x20;
//         // Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x49];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0xf0];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0xd0);
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeTruthy();
//       });
//     });
//     describe("Zero Page Addressing Mode", () => {
//       it("Should Be Zero", () => {
//         cpu.accumulator = 0x0;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x45];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x0];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x0);
//         expect(cpu.zero).toBeTruthy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Positive", () => {
//         cpu.accumulator = 0x20;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x45];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x10];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x20 ^ 0x10);
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Negative", () => {
//         cpu.accumulator = 0x80;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x45];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x0];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x80 ^ 0x0);
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeTruthy();
//       });
//     });
//     describe("Zero Page X Addressing Mode", () => {
//       it("Should Be Zero", () => {
//         cpu.x = 0x69;
//         cpu.accumulator = 1;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x55];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x0];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(cpu.x);
//           expect(bytes).toBe(0x1);
//           return [0x1];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x0);
//         expect(cpu.zero).toBeTruthy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Positive", () => {
//         cpu.x = 0x69;
//         cpu.accumulator = 0x3;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x55];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x0];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(cpu.x);
//           expect(bytes).toBe(0x1);
//           return [0x1];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x2);
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Negative", () => {
//         cpu.x = 0x69;
//         cpu.accumulator = 0x80;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x55];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x3];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x3 + cpu.x);
//           expect(bytes).toBe(0x1);
//           return [0x0];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x80);
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeTruthy();
//       });
//     });
//     describe("Absolute Addressing Mode", () => {
//       it("Should Be Zero", () => {
//         cpu.accumulator = 0x0;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x4d];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020);
//           expect(bytes).toBe(0x1);
//           return [0x0];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x0);
//         expect(cpu.zero).toBeTruthy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Positive", () => {
//         cpu.accumulator = 0x1;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x4d];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020);
//           expect(bytes).toBe(0x1);
//           return [0x0];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x1);
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Negative", () => {
//         cpu.accumulator = 0x80;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x4d];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020);
//           expect(bytes).toBe(0x1);
//           return [0x0];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x80);
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeTruthy();
//       });
//     });
//     describe("Absolute X Addressing Mode", () => {
//       it("Should Be Zero", () => {
//         cpu.accumulator = 0x0;
//         cpu.x = 0x0;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x5d];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020 + cpu.x);
//           expect(bytes).toBe(0x1);
//           return [0x0];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x0);
//         expect(cpu.zero).toBeTruthy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Positive", () => {
//         cpu.accumulator = 0x1;
//         cpu.x = 0x5;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x5d];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020 + cpu.x);
//           expect(bytes).toBe(0x1);
//           return [0x0];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x1);
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Negative", () => {
//         cpu.accumulator = 0x80;
//         cpu.x = 0x5;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x5d];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020 + cpu.x);
//           expect(bytes).toBe(0x1);
//           return [0x0];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x80);
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeTruthy();
//       });
//     });
//     describe("Absolute Y Addressing Mode", () => {
//       it("Should Be Zero", () => {
//         cpu.accumulator = 0x0;
//         cpu.y = 0x0;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x59];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020 + cpu.y);
//           expect(bytes).toBe(0x1);
//           return [0x0];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x0);
//         expect(cpu.zero).toBeTruthy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Positive", () => {
//         cpu.accumulator = 0x1;
//         cpu.y = 0x1;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x59];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020 + cpu.y);
//           expect(bytes).toBe(0x1);
//           return [0x0];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x1);
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Negative", () => {
//         cpu.accumulator = 0x80;
//         cpu.y = 0x1;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x59];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020 + cpu.y);
//           expect(bytes).toBe(0x1);
//           return [0x0];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x80);
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeTruthy();
//       });
//     });
//     describe("Indexed Indirect Addressing Mode", () => {
//       it("Should Be Zero", () => {
//         cpu.accumulator = 0x20;
//         cpu.x = 0x1;

//         // Read Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x41];
//         });

//         // Offset
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });

//         // Low
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe((0x20 + cpu.x) % 0xff);
//           expect(bytes).toBe(0x1);
//           return [0x30];
//         });

//         // High
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe((0x20 + cpu.x + 1) % 0xff);
//           expect(bytes).toBe(0x1);
//           return [0x40];
//         });

//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x4030);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });

//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x0);
//         expect(cpu.zero).toBeTruthy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Positive", () => {
//         cpu.accumulator = 0x20;
//         cpu.x = 0x1;

//         // Read Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x41];
//         });

//         // Offset
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });

//         // Low
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe((0x20 + cpu.x) % 0xff);
//           expect(bytes).toBe(0x1);
//           return [0x30];
//         });

//         // High
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe((0x20 + cpu.x + 1) % 0xff);
//           expect(bytes).toBe(0x1);
//           return [0x40];
//         });

//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x4030);
//           expect(bytes).toBe(0x1);
//           return [0x0];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x20);
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Negative", () => {
//         cpu.accumulator = 0x80;
//         cpu.x = 0x1;

//         // Read Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x41];
//         });

//         // Offset
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });

//         // Low
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe((0x20 + cpu.x) % 0xff);
//           expect(bytes).toBe(0x1);
//           return [0x30];
//         });

//         // High
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe((0x20 + cpu.x + 1) % 0xff);
//           expect(bytes).toBe(0x1);
//           return [0x40];
//         });

//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x4030);
//           expect(bytes).toBe(0x1);
//           return [0x0];
//         });

//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x80);
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeTruthy();
//       });
//     });
//     describe("Indirect Indexed Addressing Mode", () => {
//       it("Should Be Zero", () => {
//         cpu.accumulator = 0x20;
//         cpu.y = 0x1;

//         // Read Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x51];
//         });

//         // Offset
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });

//         // Low
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x20);
//           expect(bytes).toBe(0x1);
//           return [0x30];
//         });

//         // High
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe((0x20 + 1) % 0xff);
//           expect(bytes).toBe(0x1);
//           return [0x40];
//         });

//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x4030 + cpu.y);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x0);
//         expect(cpu.zero).toBeTruthy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Positive", () => {
//         cpu.accumulator = 0x20;
//         cpu.y = 0x1;

//         // Read Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x51];
//         });

//         // Offset
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });

//         // Low
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x20);
//           expect(bytes).toBe(0x1);
//           return [0x30];
//         });

//         // High
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe((0x20 + 1) % 0xff);
//           expect(bytes).toBe(0x1);
//           return [0x40];
//         });

//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x4030 + cpu.y);
//           expect(bytes).toBe(0x1);
//           return [0x0];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x20);
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Negative", () => {
//         cpu.accumulator = 0x80;
//         cpu.y = 0x1;

//         // Read Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x51];
//         });

//         // Offset
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });

//         // Low
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x20);
//           expect(bytes).toBe(0x1);
//           return [0x30];
//         });

//         // High
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe((0x20 + 1) % 0xff);
//           expect(bytes).toBe(0x1);
//           return [0x40];
//         });

//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x4030 + cpu.y);
//           expect(bytes).toBe(0x1);
//           return [0x0];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x80);
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeTruthy();
//       });
//     });
//   });

//   describe("INC", () => {
//     describe("Zero Page Addressing Mode", () => {
//       it("Should Be Positive", () => {
//         // Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xe6];
//         });
//         // Value
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x2];
//         });

//         cpu.tick();

//         expect(cpu.negative).toBeFalsy();
//         expect(cpu.zero).toBeFalsy();
//       });
//       it("Should Be Negative", () => {
//         // Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xe6];
//         });
//         // Value
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0xfe];
//         });
//         cpu.tick();

//         expect(cpu.negative).toBeTruthy();
//         expect(cpu.zero).toBeFalsy();
//       });
//       it("Should Be Zero", () => {
//         // Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xe6];
//         });
//         // Value
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [-1];
//         });
//         cpu.tick();
//         expect(cpu.negative).toBeFalsy();
//         expect(cpu.zero).toBeTruthy();
//       });
//     });
//     describe("Zero Page X Addressing Mode", () => {
//       it("Should Be Positive", () => {
//         cpu.x = 1;
//         // Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xf6];
//         });

//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });

//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x20 + cpu.x);
//           expect(bytes).toBe(0x1);
//           return [0x2];
//         });
//         cpu.tick();
//         expect(cpu.negative).toBeFalsy();
//         expect(cpu.zero).toBeFalsy();
//       });
//       it("Should Be Negative", () => {
//         cpu.x = 1;
//         // Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xf6];
//         });

//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });

//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x20 + cpu.x);
//           expect(bytes).toBe(0x1);
//           return [0xfe];
//         });

//         cpu.tick();

//         expect(cpu.negative).toBeTruthy();
//         expect(cpu.zero).toBeFalsy();
//       });
//       it("Should Be Zero", () => {
//         cpu.x = 1;
//         // Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xf6];
//         });

//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });

//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x20 + cpu.x);
//           expect(bytes).toBe(0x1);
//           return [-1];
//         });
//         cpu.tick();
//         expect(cpu.negative).toBeFalsy();
//         expect(cpu.zero).toBeTruthy();
//       });
//     });

//     describe("Absolute Addressing Mode", () => {
//       it("Should Be Postive", () => {
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xee];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020);
//           expect(bytes).toBe(0x1);
//           return [0x2];
//         });
//         cpu.tick();
//         expect(cpu.negative).toBeFalsy();
//         expect(cpu.zero).toBeFalsy();
//       });
//       it("Should Be Negative", () => {
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xee];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020);
//           expect(bytes).toBe(0x1);
//           return [0xfe];
//         });
//         cpu.tick();

//         expect(cpu.negative).toBeTruthy();
//         expect(cpu.zero).toBeFalsy();
//       });
//       it("Should Be Zero", () => {
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xee];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020);
//           expect(bytes).toBe(0x1);
//           return [-1];
//         });
//         cpu.tick();
//         expect(cpu.negative).toBeFalsy();
//         expect(cpu.zero).toBeTruthy();
//       });
//     });

//     describe("Absolute X Addressing Mode", () => {
//       it("Should Be Positive", () => {
//         cpu.x = 0x1;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xfe];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020 + cpu.x);
//           expect(bytes).toBe(0x1);
//           return [0x2];
//         });
//         cpu.tick();
//         expect(cpu.negative).toBeFalsy();
//         expect(cpu.zero).toBeFalsy();
//       });
//       it("Should Be Negative", () => {
//         cpu.x = 0x1;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xfe];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020 + cpu.x);
//           expect(bytes).toBe(0x1);
//           return [0xfe];
//         });
//         cpu.tick();
//         expect(cpu.negative).toBeTruthy();
//         expect(cpu.zero).toBeFalsy();
//       });
//       it("Should Be Zero", () => {
//         cpu.x = 0x1;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xfe];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020 + cpu.x);
//           expect(bytes).toBe(0x1);
//           return [-1];
//         });
//         cpu.tick();
//         expect(cpu.negative).toBeFalsy();
//         expect(cpu.zero).toBeTruthy();
//       });
//     });
//   });

//   describe("INX", () => {
//     describe("Implied Addressing Mode", () => {
//       it("Should Be Positive", () => {
//         cpu.x = 2;
//         // Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xe8];
//         });
//         cpu.tick();
//         expect(cpu.x).toBe(0x3);
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Negative", () => {
//         cpu.x = 0xfe;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xe8];
//         });
//         cpu.tick();
//         expect(cpu.x).toBe(0xff);
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.negative).toBeTruthy();
//       });
//       it("Should Be Zero", () => {
//         cpu.x = -1;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xe8];
//         });
//         cpu.tick();
//         expect(cpu.x).toBe(0x0);
//         expect(cpu.zero).toBeTruthy();
//         expect(cpu.negative).toBeFalsy();
//       });
//     });
//   });

//   describe("INY", () => {
//     describe("Implied Addressing Mode", () => {
//       it("Should Be Positive", () => {
//         cpu.y = 2;
//         // Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xc8];
//         });
//         cpu.tick();
//         expect(cpu.y).toBe(0x3);
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Negative", () => {
//         cpu.y = 0xfe;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xc8];
//         });
//         cpu.tick();
//         expect(cpu.y).toBe(0xff);
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.negative).toBeTruthy();
//       });
//       it("Should Be Zero", () => {
//         cpu.y = -1;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xc8];
//         });
//         cpu.tick();
//         expect(cpu.y).toBe(0x0);
//         expect(cpu.zero).toBeTruthy();
//         expect(cpu.negative).toBeFalsy();
//       });
//     });
//   });

//   describe("JMP", () => {
//     describe("Absolute Addressing Mode", () => {
//       it("Should Jump to new address", () => {
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x4c];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020);
//           expect(bytes).toBe(0x1);
//           return [0x1fe];
//         });

//         cpu.tick();

//         expect(cpu.programCounter).toBe(0x1fe);
//       });
//     });

//     describe("Indirect Addressing Mode", () => {
//       it("Should Jump to new address", () => {
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x6c];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });

//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020);
//           expect(bytes).toBe(0x2);
//           return [0xef, 0xde];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xdeef);
//           expect(bytes).toBe(0x1);
//           return [0xbeef];
//         });

//         cpu.tick();
//         expect(cpu.programCounter).toBe(0xbeef);
//       });
//     });
//   });

//   describe("PHA", () => {
//     describe("Implied Addressing Mode", () => {
//       it("Pushes a copy of the accumulator on to the stack.", () => {
//         expect(cpu.stackPointer).toBe(0xfd);
//         cpu.accumulator = 0x3;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x48];
//         });

//         bus.write.mockImplementationOnce(({ address, data }) => {
//           expect(address).toBe(cpu.stackPointer + 0x100);
//           expect(data).toStrictEqual([cpu.accumulator]);
//         });
//         cpu.tick();
//         expect(cpu.stackPointer).toBe(0xfc);
//       });
//     });
//   });

//   describe("JSR", () => {
//     describe("Absolute Addressing Mode", () => {
//       it("Pushes the address (minus one) of the return point on to the stack and then sets the program counter to the target memory address.", () => {
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });

//         // Read Absolute Address
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });

//         bus.write.mockImplementationOnce(({ address, data }) => {
//           expect(address).toBe(cpu.stackPointer + 0x100);
//           expect(data).toStrictEqual([(cpu.programCounter >> 8) & 0xff]);
//         });

//         bus.write.mockImplementationOnce(({ address, data }) => {
//           expect(address).toBe(cpu.stackPointer + 0x100);
//           expect(data).toStrictEqual([cpu.programCounter & 0xff]);
//         });

//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020);
//           expect(bytes).toBe(0x1);
//           return [0xffc];
//         });
//         cpu.tick();
//         expect(cpu.programCounter).toBe(0xffc);
//         expect(cpu.stackPointer).toBe(0xfb);
//       });
//     });
//   });

//   describe("PHP", () => {
//     describe("Implied Addressing Mode", () => {
//       it("Pushes a copy of the status flags on to the stack.", () => {
//         expect(cpu.stackPointer).toBe(0xfd);
//         cpu.zero = true;
//         cpu.carry = true;
//         cpu.interruptDisable = true;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x08];
//         });

//         bus.write.mockImplementationOnce(({ address, data }) => {
//           expect(address).toBe(cpu.stackPointer + 0x100);
//           expect(data).toStrictEqual([cpu.status]);
//         });
//         cpu.tick();
//         expect(cpu.stackPointer).toBe(0xfc);
//       });
//     });
//   });

//   describe("PLA", () => {
//     describe("Pulls an 8 bit value from the stack and into the accumulator. The zero and negative flags are set as appropriate.", () => {
//       describe("Implied Addressing Mode", () => {
//         it("Zero Flag Should Be Set", () => {
//           expect(cpu.stackPointer).toBe(0xfd);
//           bus.read.mockImplementationOnce(({ address, bytes }) => {
//             expect(address).toBe(0xffc);
//             expect(bytes).toBe(0x1);
//             return [0x68];
//           });
//           bus.read.mockImplementationOnce(({ address, bytes }) => {
//             expect(address).toBe(cpu.stackPointer + 0x100);
//             expect(bytes).toBe(0x1);
//             return [0x0];
//           });

//           cpu.tick();
//           expect(cpu.zero).toBeTruthy();
//           expect(cpu.accumulator).toBe(0x0);
//           expect(cpu.negative).toBeFalsy();
//           expect(cpu.stackPointer).toBe(0xfe);
//         });
//         it("Negative Flag Should Be Set", () => {
//           expect(cpu.stackPointer).toBe(0xfd);
//           bus.read.mockImplementationOnce(({ address, bytes }) => {
//             expect(address).toBe(0xffc);
//             expect(bytes).toBe(0x1);
//             return [0x68];
//           });
//           bus.read.mockImplementationOnce(({ address, bytes }) => {
//             expect(address).toBe(cpu.stackPointer + 0x100);
//             expect(bytes).toBe(0x1);
//             return [0xff];
//           });

//           cpu.tick();
//           expect(cpu.zero).toBeFalsy();
//           expect(cpu.accumulator).toBe(0xff);
//           expect(cpu.negative).toBeTruthy();
//           expect(cpu.stackPointer).toBe(0xfe);
//         });
//       });
//     });
//   });

//   describe("PLP", () => {
//     describe("Pulls an 8 bit value from the stack and into the processor flags. The flags will take on new states as determined by the value pulled.", () => {
//       describe("Implied Addressing Mode", () => {
//         it("All Status Flags Should Be Set", () => {
//           expect(cpu.stackPointer).toBe(0xfd);
//           bus.read.mockImplementationOnce(({ address, bytes }) => {
//             expect(address).toBe(0xffc);
//             expect(bytes).toBe(0x1);
//             return [0x28];
//           });

//           bus.read.mockImplementationOnce(({ address, bytes }) => {
//             expect(address).toBe(cpu.stackPointer + 0x100);
//             expect(bytes).toBe(0x1);
//             return [0xff];
//           });

//           cpu.tick();
//           expect(cpu.zero).toBeTruthy();
//           expect(cpu.break).toBeTruthy();
//           expect(cpu.carry).toBeTruthy();
//           expect(cpu.decimal).toBeTruthy();
//           expect(cpu.interruptDisable).toBeTruthy();
//           expect(cpu.negative).toBeTruthy();
//           expect(cpu.overflow).toBeTruthy();
//           expect(cpu.stackPointer).toBe(0xfe);
//         });
//         it("No Status Flags Should Be Set", () => {
//           expect(cpu.stackPointer).toBe(0xfd);
//           bus.read.mockImplementationOnce(({ address, bytes }) => {
//             expect(address).toBe(0xffc);
//             expect(bytes).toBe(0x1);
//             return [0x28];
//           });

//           bus.read.mockImplementationOnce(({ address, bytes }) => {
//             expect(address).toBe(cpu.stackPointer + 0x100);
//             expect(bytes).toBe(0x1);
//             return [0x00];
//           });

//           cpu.tick();
//           expect(cpu.zero).toBeFalsy();
//           expect(cpu.break).toBeFalsy();
//           expect(cpu.carry).toBeFalsy();
//           expect(cpu.decimal).toBeFalsy();
//           expect(cpu.interruptDisable).toBeFalsy();
//           expect(cpu.negative).toBeFalsy();
//           expect(cpu.overflow).toBeFalsy();
//           expect(cpu.stackPointer).toBe(0xfe);
//         });
//       });
//     });
//   });

//   describe("SEC", () => {
//     describe("Implied Addressing Mode", () => {
//       it("Carry Flag Should Be Set", () => {
//         expect(cpu.stackPointer).toBe(0xfd);
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x38];
//         });

//         cpu.tick();

//         expect(cpu.carry).toBeTruthy();
//       });
//     });
//   });

//   describe("SED", () => {
//     describe("Implied Addressing Mode", () => {
//       it("Decimal Flag Should Be Set", () => {
//         expect(cpu.stackPointer).toBe(0xfd);
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xf8];
//         });

//         cpu.tick();

//         expect(cpu.decimal).toBeTruthy();
//       });
//     });
//   });

//   describe("SEI", () => {
//     describe("Implied Addressing Mode", () => {
//       it("Interrupt Disable Flag Should Be Set", () => {
//         expect(cpu.stackPointer).toBe(0xfd);
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x78];
//         });

//         cpu.tick();

//         expect(cpu.interruptDisable).toBeTruthy();
//       });
//     });
//   });

//   describe("TAX", () => {
//     describe("Copies the current contents of the accumulator into the X register and sets the zero and negative flags as appropriate.", () => {
//       describe("Implied Addressing Mode", () => {
//         it("Zero Flag Should Be Set", () => {
//           cpu.accumulator = 0x0;
//           cpu.x = 0x0;
//           bus.read.mockImplementationOnce(({ address, bytes }) => {
//             expect(address).toBe(0xffc);
//             expect(bytes).toBe(0x1);
//             return [0xaa];
//           });

//           cpu.tick();

//           expect(cpu.x).toBe(cpu.accumulator);
//           expect(cpu.zero).toBeTruthy();
//           expect(cpu.negative).toBeFalsy();
//         });
//         it("Negative Flag Should Be Set", () => {
//           cpu.accumulator = 0x80;
//           cpu.x = 0x0;
//           bus.read.mockImplementationOnce(({ address, bytes }) => {
//             expect(address).toBe(0xffc);
//             expect(bytes).toBe(0x1);
//             return [0xaa];
//           });

//           cpu.tick();

//           expect(cpu.x).toBe(cpu.accumulator);
//           expect(cpu.zero).toBeFalsy();
//           expect(cpu.negative).toBeTruthy();
//         });
//       });
//     });
//   });

//   describe("TAY", () => {
//     describe("Copies the current contents of the accumulator into the Y register and sets the zero and negative flags as appropriate.", () => {
//       describe("Implied Addressing Mode", () => {
//         it("Zero Flag Should Be Set", () => {
//           cpu.accumulator = 0x0;
//           cpu.y = 0x0;
//           bus.read.mockImplementationOnce(({ address, bytes }) => {
//             expect(address).toBe(0xffc);
//             expect(bytes).toBe(0x1);
//             return [0xa8];
//           });

//           cpu.tick();

//           expect(cpu.y).toBe(cpu.accumulator);
//           expect(cpu.zero).toBeTruthy();
//           expect(cpu.negative).toBeFalsy();
//         });
//         it("Negative Flag Should Be Set", () => {
//           cpu.accumulator = 0x80;
//           cpu.y = 0x0;
//           bus.read.mockImplementationOnce(({ address, bytes }) => {
//             expect(address).toBe(0xffc);
//             expect(bytes).toBe(0x1);
//             return [0xa8];
//           });

//           cpu.tick();

//           expect(cpu.y).toBe(cpu.accumulator);
//           expect(cpu.zero).toBeFalsy();
//           expect(cpu.negative).toBeTruthy();
//         });
//       });
//     });
//   });

//   describe("TSX", () => {
//     describe("Copies the current contents of the stack register into the X register and sets the zero and negative flags as appropriate.", () => {
//       describe("Implied Addressing Mode", () => {
//         it("Zero Flag Should Be Set", () => {
//           cpu.stackPointer = 0x0;
//           cpu.x = 0x0;
//           bus.read.mockImplementationOnce(({ address, bytes }) => {
//             expect(address).toBe(0xffc);
//             expect(bytes).toBe(0x1);
//             return [0xba];
//           });

//           cpu.tick();

//           expect(cpu.x).toBe(cpu.stackPointer);
//           expect(cpu.zero).toBeTruthy();
//           expect(cpu.negative).toBeFalsy();
//         });
//         it("Negative Flag Should Be Set", () => {
//           cpu.stackPointer = 0x80;
//           cpu.x = 0x0;
//           bus.read.mockImplementationOnce(({ address, bytes }) => {
//             expect(address).toBe(0xffc);
//             expect(bytes).toBe(0x1);
//             return [0xba];
//           });

//           cpu.tick();

//           expect(cpu.x).toBe(cpu.stackPointer);
//           expect(cpu.zero).toBeFalsy();
//           expect(cpu.negative).toBeTruthy();
//         });
//       });
//     });
//   });

//   describe("TXA", () => {
//     describe("Copies the current contents of the X register into the accumulator and sets the zero and negative flags as appropriate.", () => {
//       describe("Implied Addressing Mode", () => {
//         it("Zero Flag Should Be Set", () => {
//           cpu.accumulator = 0x0;
//           cpu.x = 0x0;
//           bus.read.mockImplementationOnce(({ address, bytes }) => {
//             expect(address).toBe(0xffc);
//             expect(bytes).toBe(0x1);
//             return [0x8a];
//           });

//           cpu.tick();

//           expect(cpu.accumulator).toBe(cpu.x);
//           expect(cpu.zero).toBeTruthy();
//           expect(cpu.negative).toBeFalsy();
//         });
//         it("Negative Flag Should Be Set", () => {
//           cpu.accumulator = 0x0;
//           cpu.x = 0x80;
//           bus.read.mockImplementationOnce(({ address, bytes }) => {
//             expect(address).toBe(0xffc);
//             expect(bytes).toBe(0x1);
//             return [0x8a];
//           });

//           cpu.tick();

//           expect(cpu.accumulator).toBe(cpu.x);
//           expect(cpu.zero).toBeFalsy();
//           expect(cpu.negative).toBeTruthy();
//         });
//       });
//     });
//   });

//   describe("TXS", () => {
//     describe("Implied Addressing Mode", () => {
//       it("Copies the current contents of the X register into the stack register.", () => {
//         cpu.stackPointer = 0x0;
//         cpu.x = 0x40;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x9a];
//         });

//         cpu.tick();

//         expect(cpu.stackPointer).toBe(cpu.x);
//       });
//     });
//   });

//   describe("TYA", () => {
//     describe("Copies the current contents of the Y register into the accumulator and sets the zero and negative flags as appropriate.", () => {
//       describe("Implied Addressing Mode", () => {
//         it("Zero Flag Should Be Set", () => {
//           cpu.accumulator = 0x0;
//           cpu.y = 0x0;
//           bus.read.mockImplementationOnce(({ address, bytes }) => {
//             expect(address).toBe(0xffc);
//             expect(bytes).toBe(0x1);
//             return [0x98];
//           });

//           cpu.tick();

//           expect(cpu.y).toBe(cpu.accumulator);
//           expect(cpu.zero).toBeTruthy();
//           expect(cpu.negative).toBeFalsy();
//         });
//         it("Negative Flag Should Be Set", () => {
//           cpu.accumulator = 0x0;
//           cpu.y = 0x80;
//           bus.read.mockImplementationOnce(({ address, bytes }) => {
//             expect(address).toBe(0xffc);
//             expect(bytes).toBe(0x1);
//             return [0x98];
//           });

//           cpu.tick();

//           expect(cpu.accumulator).toBe(cpu.y);
//           expect(cpu.zero).toBeFalsy();
//           expect(cpu.negative).toBeTruthy();
//         });
//       });
//     });
//   });

//   describe("STA", () => {
//     describe("Stores the contents of the accumulator into memory.", () => {
//       it("Zero Page Addressing Mode", () => {
//         cpu.accumulator = 0x2;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x85];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x12];
//         });

//         bus.write.mockImplementationOnce(({ address, data }) => {
//           expect(address).toBe(0x12);
//           expect(data).toStrictEqual([cpu.accumulator]);
//         });

//         cpu.tick();

//         expect(cpu.accumulator).toBe(0x2);
//       });
//       it("Zero Page X Addressing Mode", () => {
//         cpu.x = 0x1;
//         cpu.accumulator = 0x69;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x95];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x4];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x4 + cpu.x);
//           expect(bytes).toBe(0x1);
//           return [0x12];
//         });
//         bus.write.mockImplementationOnce(({ address, data }) => {
//           expect(address).toBe(0x12);
//           expect(data).toStrictEqual([cpu.accumulator]);
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x69);
//       });
//       it("Absolute Addressing Mode", () => {
//         cpu.accumulator = 0x69;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x8d];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020);
//           expect(bytes).toBe(0x1);
//           return [0x4];
//         });
//         bus.write.mockImplementationOnce(({ address, data }) => {
//           expect(address).toBe(0x4);
//           expect(data).toStrictEqual([cpu.accumulator]);
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x69);
//       });
//       it("Absolute X Addressing Mode", () => {
//         cpu.accumulator = 0x69;
//         cpu.x = 0x2;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x9d];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020 + cpu.x);
//           expect(bytes).toBe(0x1);
//           return [0x4];
//         });
//         bus.write.mockImplementationOnce(({ address, data }) => {
//           expect(address).toBe(0x4);
//           expect(data).toStrictEqual([cpu.accumulator]);
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x69);
//       });
//       it("Absolute Y Addressing Mode", () => {
//         cpu.accumulator = 0x69;
//         cpu.y = 0x2;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x99];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020 + cpu.y);
//           expect(bytes).toBe(0x1);
//           return [0x4];
//         });
//         bus.write.mockImplementationOnce(({ address, data }) => {
//           expect(address).toBe(0x4);
//           expect(data).toStrictEqual([cpu.accumulator]);
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x69);
//       });
//       it("Indexed Indirect Addressing Mode", () => {
//         cpu.accumulator = 0x20;
//         cpu.x = 0x1;

//         // Read Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x81];
//         });

//         // Offset
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });

//         // Low
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe((0x20 + cpu.x) % 0xff);
//           expect(bytes).toBe(0x1);
//           return [0x30];
//         });

//         // High
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe((0x20 + cpu.x + 1) % 0xff);
//           expect(bytes).toBe(0x1);
//           return [0x40];
//         });

//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x4030);
//           expect(bytes).toBe(0x1);
//           return [0x9];
//         });

//         bus.write.mockImplementationOnce(({ address, data }) => {
//           expect(address).toBe(0x9);
//           expect(data).toStrictEqual([cpu.accumulator]);
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x20);
//       });
//       it("Indirect Indexed Addressing Mode", () => {
//         cpu.accumulator = 0x20;
//         cpu.y = 0x1;

//         // Read Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x91];
//         });

//         // Offset
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });

//         // Low
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x20);
//           expect(bytes).toBe(0x1);
//           return [0x30];
//         });

//         // High
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe((0x20 + 1) % 0xff);
//           expect(bytes).toBe(0x1);
//           return [0x40];
//         });

//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x4030 + cpu.y);
//           expect(bytes).toBe(0x1);
//           return [0x10];
//         });

//         bus.write.mockImplementationOnce(({ address, data }) => {
//           expect(address).toBe(0x10);
//           expect(data).toStrictEqual([cpu.accumulator]);
//         });

//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x20);
//       });
//     });
//   });

//   describe("STX", () => {
//     describe("Stores the contents of the X register into memory.", () => {
//       it("Zero Page Addressing Mode", () => {
//         cpu.x = 0x2;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x86];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x12];
//         });
//         bus.write.mockImplementationOnce(({ address, data }) => {
//           expect(address).toBe(0x12);
//           expect(data).toStrictEqual([cpu.x]);
//         });
//         cpu.tick();
//         expect(cpu.x).toBe(0x2);
//       });
//       it("Zero Page Y Addressing Mode", () => {
//         cpu.y = 0x1;
//         cpu.x = 0x20;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x96];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x4];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x4 + cpu.y);
//           expect(bytes).toBe(0x1);
//           return [0x12];
//         });
//         bus.write.mockImplementationOnce(({ address, data }) => {
//           expect(address).toBe(0x12);
//           expect(data).toStrictEqual([cpu.x]);
//         });
//         cpu.tick();
//         expect(cpu.x).toBe(0x20);
//       });
//       it("Absolute Addressing Mode", () => {
//         cpu.y = 0x69;
//         cpu.x = 0x59;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x8e];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020);
//           expect(bytes).toBe(0x1);
//           return [0x4];
//         });
//         bus.write.mockImplementationOnce(({ address, data }) => {
//           expect(address).toBe(0x4);
//           expect(data).toStrictEqual([cpu.x]);
//         });
//         cpu.tick();
//         expect(cpu.x).toBe(0x59);
//       });
//     });
//   });

//   describe("STY", () => {
//     describe("Stores the contents of the X register into memory.", () => {
//       it("Zero Page Addressing Mode", () => {
//         cpu.y = 0x2;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x84];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x12];
//         });
//         bus.write.mockImplementationOnce(({ address, data }) => {
//           expect(address).toBe(0x12);
//           expect(data).toStrictEqual([cpu.y]);
//         });
//         cpu.tick();
//         expect(cpu.y).toBe(0x2);
//       });
//       it("Zero Page X Addressing Mode", () => {
//         cpu.y = 0x1;
//         cpu.x = 0x20;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x94];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x4];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x4 + cpu.x);
//           expect(bytes).toBe(0x1);
//           return [0x12];
//         });
//         bus.write.mockImplementationOnce(({ address, data }) => {
//           expect(address).toBe(0x12);
//           expect(data).toStrictEqual([cpu.y]);
//         });
//         cpu.tick();
//         expect(cpu.y).toBe(0x1);
//       });
//       it("Absolute Addressing Mode", () => {
//         cpu.y = 0x69;
//         cpu.x = 0x59;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x8c];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020);
//           expect(bytes).toBe(0x1);
//           return [0x4];
//         });
//         bus.write.mockImplementationOnce(({ address, data }) => {
//           expect(address).toBe(0x4);
//           expect(data).toStrictEqual([cpu.y]);
//         });
//         cpu.tick();
//         expect(cpu.y).toBe(0x69);
//       });
//     });
//   });

//   describe("LDX", () => {
//     it("Immediate Addressing Mode", () => {
//       // Read Opcode
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffc);
//         expect(bytes).toBe(0x1);
//         return [0xa2];
//       });
//       // Read Immediate value
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffd);
//         expect(bytes).toBe(0x1);
//         return [0x5];
//       });
//       cpu.tick();
//       expect(cpu.x).toBe(0x5);
//     });
//     it("Zero Page Addressing Mode", () => {
//       // Read Opcode
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffc);
//         expect(bytes).toBe(0x1);
//         return [0xa6];
//       });
//       // Read Zero Page Address
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffd);
//         expect(bytes).toBe(0x1);
//         return [0x10];
//       });
//       cpu.tick();
//       expect(cpu.x).toBe(0x10);
//     });
//     it("Zero Page Y Addressing Mode", () => {
//       cpu.y = 0x1;
//       cpu.x = 0x20;
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffc);
//         expect(bytes).toBe(0x1);
//         return [0xb6];
//       });
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffd);
//         expect(bytes).toBe(0x1);
//         return [0x9];
//       });
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0x9 + cpu.y);
//         expect(bytes).toBe(0x1);
//         return [0x4];
//       });
//       cpu.tick();
//       expect(cpu.x).toBe(0x4);
//     });
//     it("Absolute Addressing Mode", () => {
//       // Read Opcode
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffc);
//         expect(bytes).toBe(0x1);
//         return [0xae];
//       });
//       // Read Absolute Address
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffd);
//         expect(bytes).toBe(0x2);
//         return [0x0, 0x1];
//       });
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0x100);
//         expect(bytes).toBe(0x1);
//         return [0x23];
//       });
//       cpu.tick();
//       expect(cpu.x).toBe(0x23);
//     });
//     it("Absolute Y Addressing Mode", () => {
//       cpu.y = 0x5;
//       // Read Opcode
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffc);
//         expect(bytes).toBe(0x1);
//         return [0xbe];
//       });
//       // Read Absolute Address
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffd);
//         expect(bytes).toBe(0x2);
//         return [0x0, 0x1];
//       });
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0x105);
//         expect(bytes).toBe(0x1);
//         return [0x23];
//       });
//       cpu.tick();
//       expect(cpu.x).toBe(0x23);
//     });
//     it("Negative Flag Set", () => {
//       // Read Opcode
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffc);
//         expect(bytes).toBe(0x1);
//         return [0xa2];
//       });
//       // Read Immediate value
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffd);
//         expect(bytes).toBe(0x1);
//         return [0xff];
//       });
//       cpu.tick();
//       expect(cpu.x).toBe(0xff);
//       expect(cpu.negative).toBe(true);
//       expect(cpu.zero).toBe(false);
//     });
//     it("Zero Flag Set", () => {
//       // Read Opcode
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffc);
//         expect(bytes).toBe(0x1);
//         return [0xa2];
//       });
//       // Read Immediate value
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffd);
//         expect(bytes).toBe(0x1);
//         return [0x0];
//       });
//       cpu.tick();
//       expect(cpu.x).toBe(0x0);
//       expect(cpu.negative).toBe(false);
//       expect(cpu.zero).toBe(true);
//     });
//   });

//   describe("LDY", () => {
//     it("Immediate Addressing Mode", () => {
//       // Read Opcode
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffc);
//         expect(bytes).toBe(0x1);
//         return [0xa0];
//       });
//       // Read Immediate value
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffd);
//         expect(bytes).toBe(0x1);
//         return [0x5];
//       });
//       cpu.tick();
//       expect(cpu.y).toBe(0x5);
//     });
//     it("Zero Page Addressing Mode", () => {
//       // Read Opcode
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffc);
//         expect(bytes).toBe(0x1);
//         return [0xa4];
//       });
//       // Read Zero Page Address
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffd);
//         expect(bytes).toBe(0x1);
//         return [0x10];
//       });
//       cpu.tick();
//       expect(cpu.y).toBe(0x10);
//     });
//     it("Zero Page X Addressing Mode", () => {
//       cpu.y = 0x1;
//       cpu.x = 0x20;
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffc);
//         expect(bytes).toBe(0x1);
//         return [0xb4];
//       });
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffd);
//         expect(bytes).toBe(0x1);
//         return [0x4];
//       });
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0x4 + cpu.x);
//         expect(bytes).toBe(0x1);
//         return [0x12];
//       });
//       cpu.tick();
//       expect(cpu.y).toBe(0x12);
//     });
//     it("Absolute Addressing Mode", () => {
//       // Read Opcode
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffc);
//         expect(bytes).toBe(0x1);
//         return [0xac];
//       });
//       // Read Absolute Address
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffd);
//         expect(bytes).toBe(0x2);
//         return [0x0, 0x1];
//       });
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0x100);
//         expect(bytes).toBe(0x1);
//         return [0x23];
//       });
//       cpu.tick();
//       expect(cpu.y).toBe(0x23);
//     });
//     it("Absolute X Addressing Mode", () => {
//       cpu.y = 0x5;
//       cpu.x = 0x7;
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffc);
//         expect(bytes).toBe(0x1);
//         return [0xbc];
//       });
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffd);
//         expect(bytes).toBe(0x2);
//         return [0x20, 0x10];
//       });
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0x1020 + cpu.x);
//         expect(bytes).toBe(0x1);
//         return [0x9];
//       });
//       cpu.tick();
//       expect(cpu.y).toBe(0x9);
//     });
//     it("Negative Flag Set", () => {
//       // Read Opcode
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffc);
//         expect(bytes).toBe(0x1);
//         return [0xa0];
//       });
//       // Read Immediate value
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffd);
//         expect(bytes).toBe(0x1);
//         return [0xff];
//       });
//       cpu.tick();
//       expect(cpu.y).toBe(0xff);
//       expect(cpu.negative).toBe(true);
//       expect(cpu.zero).toBe(false);
//     });
//     it("Zero Flag Set", () => {
//       // Read Opcode
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffc);
//         expect(bytes).toBe(0x1);
//         return [0xa0];
//       });
//       // Read Immediate value
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffd);
//         expect(bytes).toBe(0x1);
//         return [0x0];
//       });
//       cpu.tick();
//       expect(cpu.y).toBe(0x0);
//       expect(cpu.negative).toBe(false);
//       expect(cpu.zero).toBe(true);
//     });
//   });

//   describe("NOP", () => {
//     describe("The NOP instruction causes no changes to the processor other than the normal incrementing of the program counter to the next instruction.", () => {
//       it("Implied Addressing Mode", () => {
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xea];
//         });
//         cpu.tick();
//         expect(cpu.programCounter).toBe(0xffe);
//       });
//     });
//   });

//   describe("ORA", () => {
//     describe("Immediate Addressing Mode", () => {
//       it("Should Be Zero", () => {
//         cpu.accumulator = 0x0;
//         // Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x9];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x0];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x0);
//         expect(cpu.zero).toBeTruthy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Positive", () => {
//         cpu.accumulator = 0x1;
//         // Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x9];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x3];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x3);
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Negative", () => {
//         cpu.accumulator = 0x80;
//         // Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x9];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x0];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x80);
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeTruthy();
//       });
//     });
//     describe("Zero Page Addressing Mode", () => {
//       it("Should Be Zero", () => {
//         cpu.accumulator = 0x0;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x5];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x0];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x0);
//         expect(cpu.zero).toBeTruthy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Positive", () => {
//         cpu.accumulator = 0x20;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x5];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x10];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x20 | 0x10);
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Negative", () => {
//         cpu.accumulator = 0x80;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x5];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x0];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x80);
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeTruthy();
//       });
//     });
//     describe("Zero Page X Addressing Mode", () => {
//       it("Should Be Zero", () => {
//         cpu.x = 0x69;
//         cpu.accumulator = 0x0;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x15];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x0];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(cpu.x);
//           expect(bytes).toBe(0x1);
//           return [0x0];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x0);
//         expect(cpu.zero).toBeTruthy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Positive", () => {
//         cpu.x = 0x69;
//         cpu.accumulator = 0x3;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x15];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x0];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(cpu.x);
//           expect(bytes).toBe(0x1);
//           return [0x1];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x3);
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Negative", () => {
//         cpu.x = 0x69;
//         cpu.accumulator = 0x0;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x15];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x3];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x3 + cpu.x);
//           expect(bytes).toBe(0x1);
//           return [0x80];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x80);
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeTruthy();
//       });
//     });
//     describe("Absolute Addressing Mode", () => {
//       it("Should Be Zero", () => {
//         cpu.accumulator = 0x0;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x0d];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020);
//           expect(bytes).toBe(0x1);
//           return [0x0];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x0);
//         expect(cpu.zero).toBeTruthy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Positive", () => {
//         cpu.accumulator = 0x1;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x0d];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020);
//           expect(bytes).toBe(0x1);
//           return [0x0];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x1);
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Negative", () => {
//         cpu.accumulator = 0x80;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x0d];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020);
//           expect(bytes).toBe(0x1);
//           return [0x0];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x80);
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeTruthy();
//       });
//     });
//     describe("Absolute X Addressing Mode", () => {
//       it("Should Be Zero", () => {
//         cpu.accumulator = 0x0;
//         cpu.x = 0x0;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x1d];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020 + cpu.x);
//           expect(bytes).toBe(0x1);
//           return [0x0];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x0);
//         expect(cpu.zero).toBeTruthy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Positive", () => {
//         cpu.accumulator = 0x1;
//         cpu.x = 0x5;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x1d];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020 + cpu.x);
//           expect(bytes).toBe(0x1);
//           return [0x0];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x1);
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Negative", () => {
//         cpu.accumulator = 0x80;
//         cpu.x = 0x5;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x1d];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020 + cpu.x);
//           expect(bytes).toBe(0x1);
//           return [0x0];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x80);
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeTruthy();
//       });
//     });
//     describe("Absolute Y Addressing Mode", () => {
//       it("Should Be Zero", () => {
//         cpu.accumulator = 0x0;
//         cpu.y = 0x0;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x19];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020 + cpu.y);
//           expect(bytes).toBe(0x1);
//           return [0x0];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x0);
//         expect(cpu.zero).toBeTruthy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Positive", () => {
//         cpu.accumulator = 0x1;
//         cpu.y = 0x1;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x19];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020 + cpu.y);
//           expect(bytes).toBe(0x1);
//           return [0x0];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x1);
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Negative", () => {
//         cpu.accumulator = 0x80;
//         cpu.y = 0x1;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x19];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020 + cpu.y);
//           expect(bytes).toBe(0x1);
//           return [0x0];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x80);
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeTruthy();
//       });
//     });
//     describe("Indexed Indirect Addressing Mode", () => {
//       it("Should Be Zero", () => {
//         cpu.accumulator = 0x0;
//         cpu.x = 0x1;

//         // Read Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x1];
//         });

//         // Offset
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });

//         // Low
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe((0x20 + cpu.x) % 0xff);
//           expect(bytes).toBe(0x1);
//           return [0x30];
//         });

//         // High
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe((0x20 + cpu.x + 1) % 0xff);
//           expect(bytes).toBe(0x1);
//           return [0x40];
//         });

//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x4030);
//           expect(bytes).toBe(0x1);
//           return [0x0];
//         });

//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x0);
//         expect(cpu.zero).toBeTruthy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Positive", () => {
//         cpu.accumulator = 0x20;
//         cpu.x = 0x1;

//         // Read Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x1];
//         });

//         // Offset
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });

//         // Low
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe((0x20 + cpu.x) % 0xff);
//           expect(bytes).toBe(0x1);
//           return [0x30];
//         });

//         // High
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe((0x20 + cpu.x + 1) % 0xff);
//           expect(bytes).toBe(0x1);
//           return [0x40];
//         });

//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x4030);
//           expect(bytes).toBe(0x1);
//           return [0x0];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x20);
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Negative", () => {
//         cpu.accumulator = 0x80;
//         cpu.x = 0x1;

//         // Read Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x1];
//         });

//         // Offset
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });

//         // Low
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe((0x20 + cpu.x) % 0xff);
//           expect(bytes).toBe(0x1);
//           return [0x30];
//         });

//         // High
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe((0x20 + cpu.x + 1) % 0xff);
//           expect(bytes).toBe(0x1);
//           return [0x40];
//         });

//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x4030);
//           expect(bytes).toBe(0x1);
//           return [0x0];
//         });

//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x80);
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeTruthy();
//       });
//     });
//     describe("Indirect Indexed Addressing Mode", () => {
//       it("Should Be Zero", () => {
//         cpu.accumulator = 0x0;
//         cpu.y = 0x1;

//         // Read Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x11];
//         });

//         // Offset
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });

//         // Low
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x20);
//           expect(bytes).toBe(0x1);
//           return [0x30];
//         });

//         // High
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe((0x20 + 1) % 0xff);
//           expect(bytes).toBe(0x1);
//           return [0x40];
//         });

//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x4030 + cpu.y);
//           expect(bytes).toBe(0x1);
//           return [0x0];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x0);
//         expect(cpu.zero).toBeTruthy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Positive", () => {
//         cpu.accumulator = 0x20;
//         cpu.y = 0x1;

//         // Read Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x11];
//         });

//         // Offset
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });

//         // Low
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x20);
//           expect(bytes).toBe(0x1);
//           return [0x30];
//         });

//         // High
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe((0x20 + 1) % 0xff);
//           expect(bytes).toBe(0x1);
//           return [0x40];
//         });

//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x4030 + cpu.y);
//           expect(bytes).toBe(0x1);
//           return [0x0];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x20);
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Negative", () => {
//         cpu.accumulator = 0x80;
//         cpu.y = 0x1;

//         // Read Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x11];
//         });

//         // Offset
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });

//         // Low
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x20);
//           expect(bytes).toBe(0x1);
//           return [0x30];
//         });

//         // High
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe((0x20 + 1) % 0xff);
//           expect(bytes).toBe(0x1);
//           return [0x40];
//         });

//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x4030 + cpu.y);
//           expect(bytes).toBe(0x1);
//           return [0x0];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x80);
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeTruthy();
//       });
//     });
//   });

//   describe("CPX", () => {
//     describe("Immediate Addressing Mode", () => {
//       it("Should Be Equal", () => {
//         cpu.x = 0x20;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xe0];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });
//         cpu.tick();
//         expect(cpu.zero).toBeTruthy();
//         expect(cpu.carry).toBeTruthy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Greater Than", () => {
//         cpu.x = 0x20;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xe0];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x10];
//         });
//         cpu.tick();
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeTruthy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Less Than", () => {
//         cpu.x = 0x10;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xe0];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });
//         cpu.tick();
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeTruthy();
//       });
//     });

//     describe("Zero Page Addressing Mode", () => {
//       it("Should Be Equal", () => {
//         cpu.x = 0x20;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xe4];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });
//         cpu.tick();
//         expect(cpu.zero).toBeTruthy();
//         expect(cpu.carry).toBeTruthy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should be greater than", () => {
//         cpu.x = 0x20;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xe4];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x10];
//         });
//         cpu.tick();
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeTruthy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Less Than", () => {
//         cpu.x = 0x10;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xe4];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });
//         cpu.tick();
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeTruthy();
//       });
//     });

//     describe("Absolute Addressing Mode", () => {
//       it("Should Be Equal", () => {
//         cpu.x = 0x20;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xec];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });
//         cpu.tick();
//         expect(cpu.zero).toBeTruthy();
//         expect(cpu.carry).toBeTruthy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should be greater than", () => {
//         cpu.x = 0x20;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xec];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x10);
//           expect(bytes).toBe(0x1);
//           return [0x10];
//         });
//         cpu.tick();
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeTruthy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Less Than", () => {
//         cpu.x = 0x10;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xec];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x20);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });
//         cpu.tick();
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeTruthy();
//       });
//     });
//   });

//   describe("CPY", () => {
//     describe("Immediate Addressing Mode", () => {
//       it("Should Be Equal", () => {
//         cpu.y = 0x20;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xc0];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });
//         cpu.tick();
//         expect(cpu.zero).toBeTruthy();
//         expect(cpu.carry).toBeTruthy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Greater Than", () => {
//         cpu.y = 0x20;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xc0];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x10];
//         });
//         cpu.tick();
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeTruthy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Less Than", () => {
//         cpu.y = 0x10;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xc0];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });
//         cpu.tick();
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeTruthy();
//       });
//     });

//     describe("Zero Page Addressing Mode", () => {
//       it("Should Be Equal", () => {
//         cpu.y = 0x20;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xc4];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });
//         cpu.tick();
//         expect(cpu.zero).toBeTruthy();
//         expect(cpu.carry).toBeTruthy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should be greater than", () => {
//         cpu.y = 0x20;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xc4];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x10];
//         });
//         cpu.tick();
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeTruthy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Less Than", () => {
//         cpu.y = 0x10;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xc4];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });
//         cpu.tick();
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeTruthy();
//       });
//     });

//     describe("Absolute Addressing Mode", () => {
//       it("Should Be Equal", () => {
//         cpu.y = 0x20;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xcc];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });
//         cpu.tick();
//         expect(cpu.zero).toBeTruthy();
//         expect(cpu.carry).toBeTruthy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should be greater than", () => {
//         cpu.y = 0x20;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xcc];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x10);
//           expect(bytes).toBe(0x1);
//           return [0x10];
//         });
//         cpu.tick();
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeTruthy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Less Than", () => {
//         cpu.y = 0x10;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0xcc];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x20);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });
//         cpu.tick();
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeTruthy();
//       });
//     });
//   });

//   describe("AND", () => {
//     describe("Immediate Addressing Mode", () => {
//       it("Should Be Zero", () => {
//         cpu.accumulator = 0x0;
//         // Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x29];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x0];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x0);
//         expect(cpu.zero).toBeTruthy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Positive", () => {
//         cpu.accumulator = 0x1;
//         // Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x29];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x1];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x1);
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Negative", () => {
//         cpu.accumulator = 0x80;
//         // Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x29];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x80];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x80);
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeTruthy();
//       });
//     });
//     describe("Zero Page Addressing Mode", () => {
//       it("Should Be Zero", () => {
//         cpu.accumulator = 0x0;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x25];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x0];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x0);
//         expect(cpu.zero).toBeTruthy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Positive", () => {
//         cpu.accumulator = 0x2;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x25];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x2];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x2);
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Negative", () => {
//         cpu.accumulator = 0x80;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x25];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x80];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x80);
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeTruthy();
//       });
//     });
//     describe("Zero Page X Addressing Mode", () => {
//       it("Should Be Zero", () => {
//         cpu.x = 0x69;
//         cpu.accumulator = 0x0;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x35];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x0];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(cpu.x);
//           expect(bytes).toBe(0x1);
//           return [0x0];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x0);
//         expect(cpu.zero).toBeTruthy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Positive", () => {
//         cpu.x = 0x69;
//         cpu.accumulator = 0x40;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x35];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x0];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(cpu.x);
//           expect(bytes).toBe(0x1);
//           return [0x40];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x40);
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Negative", () => {
//         cpu.x = 0x69;
//         cpu.accumulator = 0x80;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x35];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x3];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x3 + cpu.x);
//           expect(bytes).toBe(0x1);
//           return [0x80];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x80);
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeTruthy();
//       });
//     });
//     describe("Absolute Addressing Mode", () => {
//       it("Should Be Zero", () => {
//         cpu.accumulator = 0x0;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x2d];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020);
//           expect(bytes).toBe(0x1);
//           return [0x0];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x0);
//         expect(cpu.zero).toBeTruthy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Positive", () => {
//         cpu.accumulator = 0x1;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x2d];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020);
//           expect(bytes).toBe(0x1);
//           return [0x1];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x1);
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Negative", () => {
//         cpu.accumulator = 0x80;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x2d];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020);
//           expect(bytes).toBe(0x1);
//           return [0x80];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x80);
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeTruthy();
//       });
//     });
//     describe("Absolute X Addressing Mode", () => {
//       it("Should Be Zero", () => {
//         cpu.accumulator = 0x0;
//         cpu.x = 0x0;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x3d];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020 + cpu.x);
//           expect(bytes).toBe(0x1);
//           return [0x0];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x0);
//         expect(cpu.zero).toBeTruthy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Positive", () => {
//         cpu.accumulator = 0x1;
//         cpu.x = 0x5;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x3d];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020 + cpu.x);
//           expect(bytes).toBe(0x1);
//           return [0x1];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x1);
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Negative", () => {
//         cpu.accumulator = 0x80;
//         cpu.x = 0x5;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x3d];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020 + cpu.x);
//           expect(bytes).toBe(0x1);
//           return [0x80];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x80);
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeTruthy();
//       });
//     });
//     describe("Absolute Y Addressing Mode", () => {
//       it("Should Be Zero", () => {
//         cpu.accumulator = 0x0;
//         cpu.y = 0x0;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x39];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020 + cpu.y);
//           expect(bytes).toBe(0x1);
//           return [0x0];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x0);
//         expect(cpu.zero).toBeTruthy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Positive", () => {
//         cpu.accumulator = 0x1;
//         cpu.y = 0x1;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x39];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020 + cpu.y);
//           expect(bytes).toBe(0x1);
//           return [0x1];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x1);
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Negative", () => {
//         cpu.accumulator = 0x80;
//         cpu.y = 0x1;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x39];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020 + cpu.y);
//           expect(bytes).toBe(0x1);
//           return [0x80];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x80);
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeTruthy();
//       });
//     });
//     describe("Indexed Indirect Addressing Mode", () => {
//       it("Should Be Zero", () => {
//         cpu.accumulator = 0x0;
//         cpu.x = 0x1;

//         // Read Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x21];
//         });

//         // Offset
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });

//         // Low
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe((0x20 + cpu.x) % 0xff);
//           expect(bytes).toBe(0x1);
//           return [0x30];
//         });

//         // High
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe((0x20 + cpu.x + 1) % 0xff);
//           expect(bytes).toBe(0x1);
//           return [0x40];
//         });

//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x4030);
//           expect(bytes).toBe(0x1);
//           return [0x0];
//         });

//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x0);
//         expect(cpu.zero).toBeTruthy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Positive", () => {
//         cpu.accumulator = 0x20;
//         cpu.x = 0x1;

//         // Read Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x21];
//         });

//         // Offset
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });

//         // Low
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe((0x20 + cpu.x) % 0xff);
//           expect(bytes).toBe(0x1);
//           return [0x30];
//         });

//         // High
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe((0x20 + cpu.x + 1) % 0xff);
//           expect(bytes).toBe(0x1);
//           return [0x40];
//         });

//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x4030);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x20);
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Negative", () => {
//         cpu.accumulator = 0x80;
//         cpu.x = 0x1;

//         // Read Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x21];
//         });

//         // Offset
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });

//         // Low
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe((0x20 + cpu.x) % 0xff);
//           expect(bytes).toBe(0x1);
//           return [0x30];
//         });

//         // High
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe((0x20 + cpu.x + 1) % 0xff);
//           expect(bytes).toBe(0x1);
//           return [0x40];
//         });

//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x4030);
//           expect(bytes).toBe(0x1);
//           return [0x80];
//         });

//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x80);
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeTruthy();
//       });
//     });
//     describe("Indirect Indexed Addressing Mode", () => {
//       it("Should Be Zero", () => {
//         cpu.accumulator = 0x0;
//         cpu.y = 0x1;

//         // Read Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x31];
//         });

//         // Offset
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });

//         // Low
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x20);
//           expect(bytes).toBe(0x1);
//           return [0x30];
//         });

//         // High
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe((0x20 + 1) % 0xff);
//           expect(bytes).toBe(0x1);
//           return [0x40];
//         });

//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x4030 + cpu.y);
//           expect(bytes).toBe(0x1);
//           return [0x0];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x0);
//         expect(cpu.zero).toBeTruthy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Positive", () => {
//         cpu.accumulator = 0x20;
//         cpu.y = 0x1;

//         // Read Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x31];
//         });

//         // Offset
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });

//         // Low
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x20);
//           expect(bytes).toBe(0x1);
//           return [0x30];
//         });

//         // High
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe((0x20 + 1) % 0xff);
//           expect(bytes).toBe(0x1);
//           return [0x40];
//         });

//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x4030 + cpu.y);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x20);
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//       });
//       it("Should Be Negative", () => {
//         cpu.accumulator = 0x80;
//         cpu.y = 0x1;

//         // Read Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x31];
//         });

//         // Offset
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });

//         // Low
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x20);
//           expect(bytes).toBe(0x1);
//           return [0x30];
//         });

//         // High
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe((0x20 + 1) % 0xff);
//           expect(bytes).toBe(0x1);
//           return [0x40];
//         });

//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x4030 + cpu.y);
//           expect(bytes).toBe(0x1);
//           return [0x80];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x80);
//         expect(cpu.zero).toBeFalsy();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeTruthy();
//       });
//     });
//   });

//   describe("LSR", () => {
//     describe("Accumulator Addressing Mode", () => {
//       it("Should Carry", () => {
//         cpu.accumulator = 0x1ff;

//         // Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x4a];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0xff);
//         expect(cpu.carry).toBeTruthy();
//         expect(cpu.negative).toBeTruthy();
//         expect(cpu.zero).toBeFalsy();
//       });
//       it("Should Not Carry", () => {
//         cpu.accumulator = 0x3;

//         // Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x4a];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x1);
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//         expect(cpu.zero).toBeFalsy();
//       });
//       it("Should Be Negative", () => {
//         cpu.accumulator = 0x1ff;
//         // Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x4a];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0xff);
//         expect(cpu.carry).toBeTruthy();
//         expect(cpu.negative).toBeTruthy();
//         expect(cpu.zero).toBeFalsy();
//       });
//       it("Should Be Zero", () => {
//         cpu.accumulator = 0x1;
//         // Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x4a];
//         });
//         cpu.tick();
//         expect(cpu.accumulator).toBe(0x0);
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//         expect(cpu.zero).toBeTruthy();
//       });
//     });
//     describe("Zero Page Addressing Mode", () => {
//       it("Should Carry", () => {
//         // Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x46];
//         });

//         // Value
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x1ff];
//         });

//         cpu.tick();

//         expect(cpu.carry).toBeTruthy();
//         expect(cpu.negative).toBeTruthy();
//         expect(cpu.zero).toBeFalsy();
//       });
//       it("Should Not Carry", () => {
//         // Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x46];
//         });

//         // Value
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x3];
//         });

//         cpu.tick();

//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//         expect(cpu.zero).toBeFalsy();
//       });
//       it("Should Be Negative", () => {
//         // Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x46];
//         });

//         // Value
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x1ff];
//         });

//         cpu.tick();

//         expect(cpu.carry).toBeTruthy();
//         expect(cpu.negative).toBeTruthy();
//         expect(cpu.zero).toBeFalsy();
//       });
//       it("Should Be Zero", () => {
//         // Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x46];
//         });

//         // Value
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x1];
//         });
//         cpu.tick();

//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//         expect(cpu.zero).toBeTruthy();
//       });
//     });
//     describe("Zero Page X Addressing Mode", () => {
//       it("Should Carry", () => {
//         cpu.x = 1;
//         // Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x56];
//         });

//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });

//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x20 + cpu.x);
//           expect(bytes).toBe(0x1);
//           return [0x1ff];
//         });
//         cpu.tick();
//         expect(cpu.carry).toBeTruthy();
//         expect(cpu.negative).toBeTruthy();
//         expect(cpu.zero).toBeFalsy();
//       });
//       it("Should Be Negative", () => {
//         cpu.x = 1;
//         // Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x56];
//         });

//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });

//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x20 + cpu.x);
//           expect(bytes).toBe(0x1);
//           return [0x1ff];
//         });
//         cpu.tick();
//         expect(cpu.carry).toBeTruthy();
//         expect(cpu.negative).toBeTruthy();
//         expect(cpu.zero).toBeFalsy();
//       });
//       it("Should Be Zero", () => {
//         cpu.x = 1;
//         // Opcode
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x56];
//         });

//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x1);
//           return [0x20];
//         });

//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x20 + cpu.x);
//           expect(bytes).toBe(0x1);
//           return [0x1];
//         });
//         cpu.tick();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//         expect(cpu.zero).toBeTruthy();
//       });
//     });
//     describe("Absolute Addressing Mode", () => {
//       it("Should Carry", () => {
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x4e];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020);
//           expect(bytes).toBe(0x1);
//           return [0x1ff];
//         });
//         cpu.tick();
//         expect(cpu.carry).toBeTruthy();
//         expect(cpu.negative).toBeTruthy();
//         expect(cpu.zero).toBeFalsy();
//       });
//       it("Should Not Carry", () => {
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x4e];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020);
//           expect(bytes).toBe(0x1);
//           return [0xff];
//         });
//         cpu.tick();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//         expect(cpu.zero).toBeFalsy();
//       });
//       it("Should Be Negative", () => {
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x4e];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020);
//           expect(bytes).toBe(0x1);
//           return [0x1ff];
//         });
//         cpu.tick();
//         expect(cpu.carry).toBeTruthy();
//         expect(cpu.negative).toBeTruthy();
//         expect(cpu.zero).toBeFalsy();
//       });
//       it("Should Be Zero", () => {
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x4e];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020);
//           expect(bytes).toBe(0x1);
//           return [0x1];
//         });
//         cpu.tick();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//         expect(cpu.zero).toBeTruthy();
//       });
//     });
//     describe("Absolute X Addressing Mode", () => {
//       it("Should Carry", () => {
//         cpu.x = 0x1;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x5e];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020 + cpu.x);
//           expect(bytes).toBe(0x1);
//           return [0x1ff];
//         });
//         cpu.tick();
//         expect(cpu.carry).toBeTruthy();
//         expect(cpu.negative).toBeTruthy();
//         expect(cpu.zero).toBeFalsy();
//       });
//       it("Should Not Carry", () => {
//         cpu.x = 0x1;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x5e];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020 + cpu.x);
//           expect(bytes).toBe(0x1);
//           return [0xff];
//         });
//         cpu.tick();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//         expect(cpu.zero).toBeFalsy();
//       });
//       it("Should Be Negative", () => {
//         cpu.x = 0x1;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x5e];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020 + cpu.x);
//           expect(bytes).toBe(0x1);
//           return [0x1ff];
//         });
//         cpu.tick();
//         expect(cpu.carry).toBeTruthy();
//         expect(cpu.negative).toBeTruthy();
//         expect(cpu.zero).toBeFalsy();
//       });
//       it("Should Be Zero", () => {
//         cpu.x = 0x1;
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffc);
//           expect(bytes).toBe(0x1);
//           return [0x5e];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0xffd);
//           expect(bytes).toBe(0x2);
//           return [0x20, 0x10];
//         });
//         bus.read.mockImplementationOnce(({ address, bytes }) => {
//           expect(address).toBe(0x1020 + cpu.x);
//           expect(bytes).toBe(0x1);
//           return [0x1];
//         });
//         cpu.tick();
//         expect(cpu.carry).toBeFalsy();
//         expect(cpu.negative).toBeFalsy();
//         expect(cpu.zero).toBeTruthy();
//       });
//     });
//   });

//   describe("ROL", () => {
//     it("Accumulator Addressing Mode", () => {
//       cpu.accumulator = 0xef;
//       // Opcode
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffc);
//         expect(bytes).toBe(0x1);
//         return [0x2a];
//       });
//       cpu.tick();

//       expect(cpu.accumulator).toBe(0xde);
//       expect(cpu.carry).toBeFalsy();
//       expect(cpu.negative).toBeTruthy();
//       expect(cpu.zero).toBeFalsy();
//     });
//     it("Zero Page Addressing Mode", () => {
//       // Opcode
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffc);
//         expect(bytes).toBe(0x1);
//         return [0x26];
//       });

//       // Value
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffd);
//         expect(bytes).toBe(0x1);
//         return [0x2];
//       });
//       cpu.tick();

//       expect(cpu.carry).toBeFalsy();
//       expect(cpu.negative).toBeFalsy();
//       expect(cpu.zero).toBeFalsy();
//     });
//     it("Zero Page X Addressing Mode", () => {
//       cpu.x = 1;
//       // Opcode
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffc);
//         expect(bytes).toBe(0x1);
//         return [0x36];
//       });

//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffd);
//         expect(bytes).toBe(0x1);
//         return [0x20];
//       });

//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0x20 + cpu.x);
//         expect(bytes).toBe(0x1);
//         return [0xef];
//       });
//       cpu.tick();

//       expect(cpu.carry).toBeTruthy();
//       expect(cpu.negative).toBeTruthy();
//       expect(cpu.zero).toBeFalsy();
//     });
//     it("Absolute Addressing Mode", () => {
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffc);
//         expect(bytes).toBe(0x1);
//         return [0x2e];
//       });
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffd);
//         expect(bytes).toBe(0x2);
//         return [0x20, 0x10];
//       });
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0x1020);
//         expect(bytes).toBe(0x1);
//         return [0xef];
//       });
//       cpu.tick();

//       expect(cpu.carry).toBeTruthy();
//       expect(cpu.negative).toBeTruthy();
//       expect(cpu.zero).toBeFalsy();
//     });
//     it("Absolute X Addressing Mode", () => {
//       cpu.x = 0x1;
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffc);
//         expect(bytes).toBe(0x1);
//         return [0x3e];
//       });
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffd);
//         expect(bytes).toBe(0x2);
//         return [0x20, 0x10];
//       });
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0x1020 + cpu.x);
//         expect(bytes).toBe(0x1);
//         return [0x0];
//       });
//       cpu.tick();
//       expect(cpu.carry).toBeFalsy();
//       expect(cpu.negative).toBeFalsy();
//       expect(cpu.zero).toBeTruthy();
//     });
//   });

//   describe("ROR", () => {
//     it("Accumulator Addressing Mode", () => {
//       cpu.accumulator = 0xef;
//       // Opcode
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffc);
//         expect(bytes).toBe(0x1);
//         return [0x6a];
//       });
//       cpu.tick();

//       expect(cpu.accumulator).toBe(0x77);
//       expect(cpu.carry).toBeFalsy();
//       expect(cpu.negative).toBeFalsy();
//       expect(cpu.zero).toBeFalsy();
//     });
//     it("Zero Page Addressing Mode", () => {
//       // Opcode
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffc);
//         expect(bytes).toBe(0x1);
//         return [0x66];
//       });

//       // Value
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffd);
//         expect(bytes).toBe(0x1);
//         return [0xef];
//       });
//       cpu.tick();
//       expect(cpu.carry).toBeFalsy();
//       expect(cpu.negative).toBeFalsy();
//       expect(cpu.zero).toBeFalsy();
//     });
//     it("Zero Page X Addressing Mode", () => {
//       cpu.x = 1;
//       // Opcode
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffc);
//         expect(bytes).toBe(0x1);
//         return [0x76];
//       });

//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffd);
//         expect(bytes).toBe(0x1);
//         return [0x20];
//       });

//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0x20 + cpu.x);
//         expect(bytes).toBe(0x1);
//         return [0xef];
//       });
//       cpu.tick();
//       expect(cpu.carry).toBeFalsy();
//       expect(cpu.negative).toBeFalsy();
//       expect(cpu.zero).toBeFalsy();
//     });
//     it("Absolute Addressing Mode", () => {
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffc);
//         expect(bytes).toBe(0x1);
//         return [0x6e];
//       });
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffd);
//         expect(bytes).toBe(0x2);
//         return [0x20, 0x10];
//       });
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0x1020);
//         expect(bytes).toBe(0x1);
//         return [0xef];
//       });
//       cpu.tick();
//       expect(cpu.carry).toBeFalsy();
//       expect(cpu.negative).toBeFalsy();
//       expect(cpu.zero).toBeFalsy();
//     });
//     it("Absolute X Addressing Mode", () => {
//       cpu.x = 0x1;
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffc);
//         expect(bytes).toBe(0x1);
//         return [0x7e];
//       });
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffd);
//         expect(bytes).toBe(0x2);
//         return [0x20, 0x10];
//       });
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0x1020 + cpu.x);
//         expect(bytes).toBe(0x1);
//         return [0xef];
//       });
//       cpu.tick();
//       expect(cpu.carry).toBeFalsy();
//       expect(cpu.negative).toBeFalsy();
//       expect(cpu.zero).toBeFalsy();
//     });
//   });

//   describe("RTI", () => {
//     it("Implied Addressing Mode", () => {
//       // Opcode
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffc);
//         expect(bytes).toBe(0x1);
//         return [0x40];
//       });

//       //New Status
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0x1fe);
//         expect(bytes).toBe(0x1);
//         return [0x3];
//       });

//       // Low
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0x1ff);
//         expect(bytes).toBe(0x1);
//         return [0x3];
//       });

//       // High
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0x200);
//         expect(bytes).toBe(0x1);
//         return [0x3];
//       });

//       cpu.tick();
//       expect(cpu.programCounter).toBe(0x303);
//       expect(cpu.status).toBe(0x3);
//       expect(cpu.carry).toBeTruthy();
//       expect(cpu.zero).toBeTruthy();
//     });
//   });

//   describe("RTS", () => {
//     it("Implied Addressing Mode", () => {
//       // Opcode
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffc);
//         expect(bytes).toBe(0x1);
//         return [0x60];
//       });

//       // Low
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0x1fe);
//         expect(bytes).toBe(0x1);
//         return [0x3];
//       });

//       // High
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0x1ff);
//         expect(bytes).toBe(0x1);
//         return [0x4];
//       });

//       cpu.tick();
//       expect(cpu.programCounter).toBe(0x404);
//     });
//   });

//   describe("ADC", () => {
//     it("Immediate Addressing Mode", () => {
//       // Opcode
//       cpu.accumulator = 0x10;
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffc);
//         expect(bytes).toBe(0x1);
//         return [0x69];
//       });

//       // Operand
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffd);
//         expect(bytes).toBe(0x1);
//         return [0x20];
//       });

//       cpu.tick();
//       expect(cpu.accumulator).toBe(0x30);
//       expect(cpu.carry).toBeFalsy();
//       expect(cpu.zero).toBeFalsy();
//       expect(cpu.overflow).toBeFalsy();
//       expect(cpu.negative).toBeFalsy();
//     });
//     it("Zero Page Addressing Mode", () => {
//       cpu.accumulator = 0x10;
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffc);
//         expect(bytes).toBe(0x1);
//         return [0x65];
//       });
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffd);
//         expect(bytes).toBe(0x1);
//         return [0x20];
//       });
//       cpu.tick();
//       expect(cpu.accumulator).toBe(0x30);
//       expect(cpu.carry).toBeFalsy();
//       expect(cpu.zero).toBeFalsy();
//       expect(cpu.overflow).toBeFalsy();
//       expect(cpu.negative).toBeFalsy();
//     });
//     it("Zero Page X Addressing Mode", () => {
//       cpu.x = 0x69;
//       cpu.accumulator = 0x10;
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffc);
//         expect(bytes).toBe(0x1);
//         return [0x75];
//       });
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffd);
//         expect(bytes).toBe(0x1);
//         return [0x20];
//       });
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(cpu.x + 0x20);
//         expect(bytes).toBe(0x1);
//         return [0x20];
//       });
//       cpu.tick();
//       expect(cpu.accumulator).toBe(0x30);
//       expect(cpu.carry).toBeFalsy();
//       expect(cpu.zero).toBeFalsy();
//       expect(cpu.overflow).toBeFalsy();
//       expect(cpu.negative).toBeFalsy();
//     });
//     it("Absolute Addressing Mode", () => {
//       cpu.accumulator = 0x10;
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffc);
//         expect(bytes).toBe(0x1);
//         return [0x6d];
//       });
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffd);
//         expect(bytes).toBe(0x2);
//         return [0x20, 0x10];
//       });
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0x1020);
//         expect(bytes).toBe(0x1);
//         return [0x20];
//       });
//       cpu.tick();
//       expect(cpu.accumulator).toBe(0x30);
//       expect(cpu.carry).toBeFalsy();
//       expect(cpu.zero).toBeFalsy();
//       expect(cpu.overflow).toBeFalsy();
//       expect(cpu.negative).toBeFalsy();
//     });
//     it("Absolute X Addressing Mode", () => {
//       cpu.accumulator = 0x10;
//       cpu.x = 0x5;
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffc);
//         expect(bytes).toBe(0x1);
//         return [0x7d];
//       });
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffd);
//         expect(bytes).toBe(0x2);
//         return [0x20, 0x10];
//       });
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0x1020 + cpu.x);
//         expect(bytes).toBe(0x1);
//         return [0x20];
//       });
//       cpu.tick();
//       expect(cpu.accumulator).toBe(0x30);
//       expect(cpu.carry).toBeFalsy();
//       expect(cpu.zero).toBeFalsy();
//       expect(cpu.overflow).toBeFalsy();
//       expect(cpu.negative).toBeFalsy();
//     });
//     it("Absolute Y Addressing Mode", () => {
//       cpu.accumulator = 0x10;
//       cpu.y = 0x5;
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffc);
//         expect(bytes).toBe(0x1);
//         return [0x79];
//       });
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffd);
//         expect(bytes).toBe(0x2);
//         return [0x20, 0x10];
//       });
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0x1020 + cpu.y);
//         expect(bytes).toBe(0x1);
//         return [0x20];
//       });
//       cpu.tick();
//       expect(cpu.accumulator).toBe(0x30);
//       expect(cpu.carry).toBeFalsy();
//       expect(cpu.zero).toBeFalsy();
//       expect(cpu.overflow).toBeFalsy();
//       expect(cpu.negative).toBeFalsy();
//     });
//     it("Indexed Indirect Addressing Mode", () => {
//       cpu.accumulator = 0x10;
//       cpu.x = 0x1;

//       // Read Opcode
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffc);
//         expect(bytes).toBe(0x1);
//         return [0x61];
//       });

//       // Offset
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffd);
//         expect(bytes).toBe(0x1);
//         return [0x20];
//       });

//       // Low
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe((0x20 + cpu.x) % 0xff);
//         expect(bytes).toBe(0x1);
//         return [0x30];
//       });

//       // High
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe((0x20 + cpu.x + 1) % 0xff);
//         expect(bytes).toBe(0x1);
//         return [0x40];
//       });

//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0x4030);
//         expect(bytes).toBe(0x1);
//         return [0x20];
//       });
//       cpu.tick();
//       expect(cpu.accumulator).toBe(0x30);
//       expect(cpu.carry).toBeFalsy();
//       expect(cpu.zero).toBeFalsy();
//       expect(cpu.overflow).toBeFalsy();
//       expect(cpu.negative).toBeFalsy();
//     });
//     it("Indirect Indexed Addressing Mode", () => {
//       cpu.accumulator = 0x10;
//       cpu.y = 0x1;

//       // Read Opcode
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffc);
//         expect(bytes).toBe(0x1);
//         return [0x71];
//       });

//       // Offset
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffd);
//         expect(bytes).toBe(0x1);
//         return [0x20];
//       });

//       // Low
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0x20);
//         expect(bytes).toBe(0x1);
//         return [0x30];
//       });

//       // High
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe((0x20 + 1) % 0xff);
//         expect(bytes).toBe(0x1);
//         return [0x40];
//       });

//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0x4030 + cpu.y);
//         expect(bytes).toBe(0x1);
//         return [0x20];
//       });
//       cpu.tick();
//       expect(cpu.accumulator).toBe(0x30);
//       expect(cpu.carry).toBeFalsy();
//       expect(cpu.zero).toBeFalsy();
//       expect(cpu.overflow).toBeFalsy();
//       expect(cpu.negative).toBeFalsy();
//     });
//   });

//   describe("SBC", () => {
//     it("Immediate Addressing Mode", () => {
//       // Opcode
//       cpu.accumulator = 0x9;
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffc);
//         expect(bytes).toBe(0x1);
//         return [0xe9];
//       });

//       // Operand
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffd);
//         expect(bytes).toBe(0x1);
//         return [0xc];
//       });

//       cpu.tick();
//       expect(cpu.accumulator).toBe(255 - 2);
//       expect(cpu.carry).toBeTruthy();
//       expect(cpu.zero).toBeFalsy();
//       expect(cpu.overflow).toBeFalsy();
//       expect(cpu.negative).toBeTruthy();
//     });
//     it("Zero Page Addressing Mode", () => {
//       cpu.accumulator = 0x9;
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffc);
//         expect(bytes).toBe(0x1);
//         return [0xe5];
//       });
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffd);
//         expect(bytes).toBe(0x1);
//         return [0xc];
//       });
//       cpu.tick();
//       expect(cpu.accumulator).toBe(255 - 2);
//       expect(cpu.carry).toBeTruthy();
//       expect(cpu.zero).toBeFalsy();
//       expect(cpu.overflow).toBeFalsy();
//       expect(cpu.negative).toBeTruthy();
//     });
//     it("Zero Page X Addressing Mode", () => {
//       cpu.x = 0x69;
//       cpu.accumulator = 0x9;
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffc);
//         expect(bytes).toBe(0x1);
//         return [0xf5];
//       });
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffd);
//         expect(bytes).toBe(0x1);
//         return [0x20];
//       });
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(cpu.x + 0x20);
//         expect(bytes).toBe(0x1);
//         return [0xc];
//       });
//       cpu.tick();
//       expect(cpu.accumulator).toBe(255 - 2);
//       expect(cpu.carry).toBeTruthy();
//       expect(cpu.zero).toBeFalsy();
//       expect(cpu.overflow).toBeFalsy();
//       expect(cpu.negative).toBeTruthy();
//     });
//     it("Absolute Addressing Mode", () => {
//       cpu.accumulator = 0x9;
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffc);
//         expect(bytes).toBe(0x1);
//         return [0xed];
//       });
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffd);
//         expect(bytes).toBe(0x2);
//         return [0x20, 0x10];
//       });
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0x1020);
//         expect(bytes).toBe(0x1);
//         return [0xc];
//       });
//       cpu.tick();
//       expect(cpu.accumulator).toBe(255 - 2);
//       expect(cpu.carry).toBeTruthy();
//       expect(cpu.zero).toBeFalsy();
//       expect(cpu.overflow).toBeFalsy();
//       expect(cpu.negative).toBeTruthy();
//     });
//     it("Absolute X Addressing Mode", () => {
//       cpu.accumulator = 0x9;
//       cpu.x = 0x5;
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffc);
//         expect(bytes).toBe(0x1);
//         return [0xfd];
//       });
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffd);
//         expect(bytes).toBe(0x2);
//         return [0x20, 0x10];
//       });
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0x1020 + cpu.x);
//         expect(bytes).toBe(0x1);
//         return [0xc];
//       });
//       cpu.tick();
//       expect(cpu.accumulator).toBe(255 - 2);
//       expect(cpu.carry).toBeTruthy();
//       expect(cpu.zero).toBeFalsy();
//       expect(cpu.overflow).toBeFalsy();
//       expect(cpu.negative).toBeTruthy();
//     });
//     it("Absolute Y Addressing Mode", () => {
//       cpu.accumulator = 0x9;
//       cpu.y = 0x5;
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffc);
//         expect(bytes).toBe(0x1);
//         return [0xf9];
//       });
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffd);
//         expect(bytes).toBe(0x2);
//         return [0x20, 0x10];
//       });
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0x1020 + cpu.y);
//         expect(bytes).toBe(0x1);
//         return [0xc];
//       });
//       cpu.tick();
//       expect(cpu.accumulator).toBe(255 - 2);
//       expect(cpu.carry).toBeTruthy();
//       expect(cpu.zero).toBeFalsy();
//       expect(cpu.overflow).toBeFalsy();
//       expect(cpu.negative).toBeTruthy();
//     });
//     it("Indexed Indirect Addressing Mode", () => {
//       cpu.accumulator = 0x9;
//       cpu.x = 0x1;

//       // Read Opcode
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffc);
//         expect(bytes).toBe(0x1);
//         return [0xe1];
//       });

//       // Offset
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffd);
//         expect(bytes).toBe(0x1);
//         return [0x20];
//       });

//       // Low
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe((0x20 + cpu.x) % 0xff);
//         expect(bytes).toBe(0x1);
//         return [0x30];
//       });

//       // High
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe((0x20 + cpu.x + 1) % 0xff);
//         expect(bytes).toBe(0x1);
//         return [0x40];
//       });

//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0x4030);
//         expect(bytes).toBe(0x1);
//         return [0xc];
//       });
//       cpu.tick();
//       expect(cpu.accumulator).toBe(255 - 2);
//       expect(cpu.carry).toBeTruthy();
//       expect(cpu.zero).toBeFalsy();
//       expect(cpu.overflow).toBeFalsy();
//       expect(cpu.negative).toBeTruthy();
//     });
//     it("Indirect Indexed Addressing Mode", () => {
//       cpu.accumulator = 0x9;
//       cpu.y = 0x1;

//       // Read Opcode
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffc);
//         expect(bytes).toBe(0x1);
//         return [0xf1];
//       });

//       // Offset
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0xffd);
//         expect(bytes).toBe(0x1);
//         return [0x20];
//       });

//       // Low
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0x20);
//         expect(bytes).toBe(0x1);
//         return [0x30];
//       });

//       // High
//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe((0x20 + 1) % 0xff);
//         expect(bytes).toBe(0x1);
//         return [0x40];
//       });

//       bus.read.mockImplementationOnce(({ address, bytes }) => {
//         expect(address).toBe(0x4030 + cpu.y);
//         expect(bytes).toBe(0x1);
//         return [0xc];
//       });
//       cpu.tick();
//       expect(cpu.accumulator).toBe(255 - 2);
//       expect(cpu.carry).toBeTruthy();
//       expect(cpu.zero).toBeFalsy();
//       expect(cpu.overflow).toBeFalsy();
//       expect(cpu.negative).toBeTruthy();
//     });
//   });
});

it("old", () => {
    expect(true).toBe(true)
})
