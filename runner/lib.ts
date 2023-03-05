const encoder = new TextEncoder();

export type Script = {
  SCHEMA: Record<string, string>;
  RUN: (args: Record<string, string>) => void;
};

export const stderr = (message: string) => {
  const errorMessage = encoder.encode(message + '\n');
  Deno.stderr.writeSync(errorMessage);
};

export const stdout = (message: string) => {
  const errorMessage = encoder.encode(message + '\n');
  Deno.stderr.writeSync(errorMessage);
};

const isScript = (module: Record<string, unknown>): module is Script => {
  return (
    typeof module.RUN === 'function' &&
    typeof module.SCHEMA === 'object' &&
    module.SCHEMA != null
  );
};

const scriptPath = Deno.args[0];

const module: Record<string, unknown> = await import(scriptPath).catch(() => {
  stderr(`The "${scriptPath}" script does not exist`);
  Deno.exit(1);
});

if (!isScript(module)) {
  stdout(`The "${scriptPath}" does not export a valid schema`);
  Deno.exit(1);
}

export const { RUN, SCHEMA } = module;
