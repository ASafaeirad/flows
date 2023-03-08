use colored::*;
use std::{env, path::PathBuf, process::exit};

#[derive(Clone)]
pub struct Config {
    pub script_path: PathBuf,
    pub run_script: PathBuf,
    pub schema_script: PathBuf,
}

impl Config {
    pub fn new() -> Self {
        let script_path = env::var("FLOWS_SCRIPT_PATH").unwrap_or_default();
        let mut runner_dir = env::current_dir().unwrap();
        runner_dir.pop();
        runner_dir.push("runner");

        let run_script = runner_dir.join("run.ts");
        let schema_script = runner_dir.join("schema.ts");

        Config {
            script_path: PathBuf::from(script_path),
            run_script,
            schema_script,
        }
    }

    pub fn validate(self) {
        if !self.script_path.exists() {
            println!("{}", "Script path does not exists please set the \"FLOWS_SCRIPT_PATH\" environment".red());
            exit(1);
        }
    }
}
