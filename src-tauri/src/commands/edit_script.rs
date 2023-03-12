use crate::config::Config;

#[tauri::command]
pub fn edit_script(name: &str) -> Result<(), &str> {
    let config = Config::new();
    let file = config.script_path.join(name);

    config
        .editor
        .edit_file(file, |s| {
            println!("Got this back: {}", s);
        })
        .map_err(|_e| "Cannot open the file")?;
    Ok(())
}
