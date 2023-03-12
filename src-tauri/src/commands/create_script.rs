use std::fs;

use edit::edit_file;

use crate::config::Config;

#[tauri::command]
pub fn create_script(name: &str) -> Result<(), &str> {
    let config = Config::new();
    let template = config.template_script;
    let mut file = config.script_path.join(name.to_lowercase());
    file.set_extension("ts");

    if fs::copy(template, &file).is_err() {
        edit_file(file).map_err(|_e| "Cannot open the file")?;
        return Ok(());
    }

    config
        .editor
        .edit_file(&file, |_e| {})
        .map_err(|_e| "Cannot open the file")?;
    return Ok(());
}
