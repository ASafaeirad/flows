import { isNull, isObject } from '@fullstacksjs/toolbox';

const encoder = new TextEncoder();

export interface Script {
  SCHEMA: Record<string, string>;
  RUN: (args: Record<string, string>) => void;
}

export const stderr = (message: string) => {
  const errorMessage = encoder.encode(`${message}\n`);
  Deno.stderr.writeSync(errorMessage);
};

export const stdout = (message: string) => {
  const errorMessage = encoder.encode(`${message}\n`);
  Deno.stdout.writeSync(errorMessage);
};

const isScript = (module: unknown): module is Script => {
  return (
    isObject(module) &&
    typeof module.RUN === 'function' &&
    typeof module.SCHEMA === 'object' &&
    module.SCHEMA != null
  );
};

const scriptPath = Deno.args[0];

if (isNull(scriptPath)) {
  stderr('arguments is required');
  Deno.exit(1);
}

const module: Record<string, unknown> = await import(scriptPath).catch(() => {
  stderr(`The "${scriptPath}" script does not exist`);
  Deno.exit(1);
});

if (!isScript(module)) {
  stdout(`The "${scriptPath}" does not export a valid schema`);
  Deno.exit(1);
}

export const { RUN, SCHEMA } = module;
