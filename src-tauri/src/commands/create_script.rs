use std::fs;

use edit::{edit_file};

use crate::config::Config;

#[tauri::command]
pub fn create_script(name: &str) -> Result<(), &str> {
    let config = Config::new();
    let mut file = config.script_path.join(name.to_lowercase());
    file.set_extension("ts");

    if fs::read(&file).is_err() {
        edit_file(file).map_err(|_e| "Cannot open the file")?;
        return Ok(());
    }

    fs::File::create(file).map_err(|_e| "Cannot create the file")?;
    return Ok(())
}
