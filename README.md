This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, install packages and run the development server:

```
pnpm i
```

Download nestest.nes file from [http://www.qmtpro.com/~nes/misc/]

``` Note:
Program counter 50876 (0xc6bc) is the address of the end of the test for the offical NES opcodes. This emulator succesfullly passes all of the tests up to 0xc6bc.
```

Run the development server:
```
pnpm run dev
```

Run the table driven tests:
```
pnpm run test

Enter a when prompted in terminal to run all tests.
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Load the nestest.nes by clicking choose file.

Tick to advance the program. Refer to http://www.qmtpro.com/~nes/misc/nestest.log if interested in where I recieved my tests. Using reggex I was able to isolate every line follwoing the form,
{ pc: ?, accumulator: ?, x: ?, y: ?, sp: 251 } (cpu-test-data.ts).
I then put it into an array and looped through each one ensuring my flags and registers were all correct using jest. (cpu.test.ts).





