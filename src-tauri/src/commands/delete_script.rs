use crate::config::Config;
use std::fs;

#[tauri::command]
pub fn delete_script(name: &str) -> Result<(), &str> {
    let config = Config::new();
    let filepath = config.script_path.join(name);

    fs::remove_file(&filepath).map_err(|_e| "Cannot delete the file")?;

    return Ok(());
}
