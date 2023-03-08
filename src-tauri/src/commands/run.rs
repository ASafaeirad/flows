use crate::runner;

#[tauri::command]
pub fn run(script: &str, args: &str) -> Result<String, String> {
    runner::run(script, args)
}
