This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

1. Clone the repo.

2. install packages and run the development server:

```
pnpm i
```

  2a. Download nestest.nes file from [http://www.qmtpro.com/~nes/misc/]

  ``` Note:
  Program counter 50876 (0xc6bc) is the address of the end of the test for the offical NES opcodes. This emulator succesfullly passes all of the tests up to 0xc6bc.
  ```

  2b. Run the development server:
  ```
  pnpm run dev
  ```

3. Run the table driven tests:
```
pnpm run test

Enter a when prompted in terminal to run all tests.
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

5. Load the nestest.nes by clicking choose file.

6. Tick to advance the program. Refer to http://www.qmtpro.com/~nes/misc/nestest.log Using reggex I was able to isolate every line following the form,
{ pc: ?, accumulator: ?, x: ?, y: ?, sp: 251 } (cpu-test-data.ts).
I then put it into an array and looped through each one ensuring my flags and registers were all correct using jest. (cpu.test.ts).





