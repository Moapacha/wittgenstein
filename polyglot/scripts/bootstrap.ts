import { verifyEnvironment } from "./verify-env.js";

async function main(): Promise<void> {
  const report = await verifyEnvironment(process.cwd());

  console.log(
    JSON.stringify(
      {
        ok: report.nodeSatisfied && report.hasPackageJson,
        ...report,
      },
      null,
      2,
    ),
  );

  if (!report.nodeSatisfied) {
    process.exitCode = 1;
  }
}

void main();
