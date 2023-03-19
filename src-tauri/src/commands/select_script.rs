use crate::{config::Config, utils};
use std::process::Command;

#[tauri::command]
pub fn select_script(name: &str) -> Result<String, String> {
    let config = Config::new();
    let script = config.script_path.join(name);

    let output = Command::new(config.schema_script)
        .arg(script)
        .output();

    utils::output_to_result(output)
}
