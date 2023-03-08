use anyhow::Context;
use std::fs;

use crate::config::Config;

fn read_scripts() -> anyhow::Result<Vec<String>> {
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

#[tauri::command]
pub fn get_scripts() -> Result<String, String> {
    match read_scripts() {
        Ok(scripts) => Ok(scripts.join(",")),
        Err(e) => Err(e.to_string()),
    }
}
