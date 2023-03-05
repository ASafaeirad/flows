#!/usr/bin/env -S deno run --allow-read

import { SCHEMA, stdout } from './lib.ts';
stdout(JSON.stringify(SCHEMA));
