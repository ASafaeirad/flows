use crate::config::Config;
use anyhow::{Context, Result};
use std::{
    fs,
    process::{Command, Output},
};

pub fn run(script_name: &str, args: &str) -> Result<String, String> {
    let config = Config::new();
    let script = config.script_path.join(script_name);

    let output = Command::new(config.run_script)
        .arg(script)
        .arg(args)
        .output()
        .expect("Cannot run the \"run.ts\" command");

    output_to_result(output)
}

pub fn get_schema(script_name: &str) -> Result<String, String> {
    let config = Config::new();
    let script = config.script_path.join(script_name);

    let output = Command::new(config.schema_script)
        .arg(script)
        .output()
        .expect("Cannot run the \"schema.ts\" command");

    output_to_result(output)
}

pub fn get_scripts() -> Result<Vec<String>> {
    let config = Config::new();
    let path = String::from(config.script_path.to_string_lossy());
    let scripts = fs::read_dir(config.script_path)
        .context(format!("Can not read \"{:#?}\" directory", path))?;

    let files: Vec<String> = scripts
        .into_iter()
        .flatten()
        .filter(|f| {
            let file = f.file_type().unwrap();
            file.is_file()
        })
        .map(|f| f.file_name().into_string())
        .flatten()
        .collect();

    Ok(files)
}

pub fn output_to_result(output: Output) -> Result<String, String> {
    if output.status.success() {
        Ok(String::from_utf8_lossy(&output.stdout).to_string())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}
