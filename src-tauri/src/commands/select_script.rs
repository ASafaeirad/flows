use crate::runner;

#[tauri::command]
pub fn select_script(name: &str) -> Result<String, String> {
    runner::get_schema(name)
}
