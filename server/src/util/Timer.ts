export class Timer {
  ms: number;
  intervalMs: number;
  tick: (currentMs: number) => void;

  constructor(
    ms: number,
    intervalMs: number,
    tick: (currentMs: number) => void
  ) {
    this.ms = ms;
    this.intervalMs = intervalMs;
    this.tick = tick;
  }

  async run(): Promise<void> {
    return new Promise<void>(resolve => {
      let total = 0;

      const interval = setInterval(() => {
        total += this.intervalMs;

        this.tick(total);

        if (total >= this.ms) {
          clearInterval(interval);
          resolve();
        }
      }, this.intervalMs);
    });
  }
}
