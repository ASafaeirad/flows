use std::{env, path::PathBuf};

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
        println!("{:#?}", schema_script);

        Config {
            script_path: PathBuf::from(script_path),
            run_script,
            schema_script,
        }
    }
}
