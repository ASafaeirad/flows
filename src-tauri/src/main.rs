#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use flows::{self, commands, config::Config};
use std::error::Error;

fn create_window(app: &mut tauri::App) -> Result<(), Box<dyn Error>> {
    tauri::WindowBuilder::new(app, "local", tauri::WindowUrl::App("index.html".into())).build()?;
    Ok(())
}

fn main() {
    let config = Config::new();
    config.validate();
    tauri::Builder::default()
        .setup(|app| {
            create_window(app)?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::run::run,
            commands::select_script::select_script,
            commands::get_scripts::get_scripts,
            commands::create_script::create_script
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
