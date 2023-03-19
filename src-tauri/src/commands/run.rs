use std::process::Command;

use crate::{config::Config, utils};

#[tauri::command]
pub fn run(script: &str, args: &str) -> Result<String, String> {
    let config = Config::new();
    let script = config.script_path.join(script);

    let output = Command::new(config.run_script)
        .arg(script)
        .arg(args)
        .output();

    utils::output_to_result(output)
}
