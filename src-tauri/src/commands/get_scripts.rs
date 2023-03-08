use crate::runner;

#[tauri::command]
pub fn get_scripts() -> Result<String, String> {
    match runner::get_scripts() {
        Ok(scripts) => Ok(scripts.join(",")),
        Err(e) => Err(e.to_string()),
    }
}
