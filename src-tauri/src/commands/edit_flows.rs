use crate::config::Config;

#[tauri::command]
pub fn edit_flows() -> Result<(), &'static str> {
    let config = Config::new();
    let file = config.flows_path;

    config
        .editor
        .edit_file(file, |s| {
            println!("Got this back: {}", s);
        })
        .map_err(|_e| "Cannot open the file")?;
    Ok(())
}
