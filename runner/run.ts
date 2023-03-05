#!/usr/bin/env -S deno run --allow-read

import { RUN } from './lib.ts';

const values = JSON.parse(Deno.args[1]);
RUN(values);
