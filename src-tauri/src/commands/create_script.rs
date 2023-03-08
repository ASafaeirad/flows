#[tauri::command]
pub fn create_script(name: &str) -> String {
  name.to_owned()
}
