#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use flows::runner;
use std::error::Error;

#[tauri::command]
fn run(args: &str) -> Result<String, String> {
    runner::run("test.ts", args)
}

fn create_window(app: &mut tauri::App) -> Result<(), Box<dyn Error>> {
    tauri::WindowBuilder::new(app, "local", tauri::WindowUrl::App("index.html".into())).build()?;
    Ok(())
}

#[tauri::command]
fn get_scripts() -> Result<String, String> {
    match runner::get_scripts() {
        Ok(scripts) => Ok(scripts.join(",")),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
fn select_script(name: &str) -> Result<String, String> {
    runner::get_schema(name)
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            create_window(app)?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![run, select_script, get_scripts])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
