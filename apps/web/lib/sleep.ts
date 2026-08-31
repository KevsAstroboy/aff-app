export const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export const latency = () => 200 + Math.floor(Math.random() * 300);
