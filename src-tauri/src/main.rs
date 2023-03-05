#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::{error::Error, path::PathBuf, process::Command};

use flows::parser::get_prompts;

#[tauri::command]
fn run(args: &str) -> String {
    let loc = std::env::var("FLOWS_SCRIPT_PATH").expect("");
    let script = "file1.ts";
    let mut path = PathBuf::from(loc);
    path.push(script);
    let mut child = Command::new(path)
        .arg(args)
        .spawn()
        .expect("failed to execute child");
    let _ecode = child.wait().expect("failed to wait on child");
    return "Shit".to_string();
}

fn create_window(app: &mut tauri::App) -> Result<(), Box<dyn Error>> {
    tauri::WindowBuilder::new(app, "local", tauri::WindowUrl::App("index.html".into())).build()?;
    Ok(())
}

#[tauri::command]
fn init() -> String {
    let loc = std::env::var("FLOWS_SCRIPT_PATH").expect("");
    let script = "file1.ts";
    let mut path = PathBuf::from(loc);
    path.push(script);
    let prompts = get_prompts(path.as_path());
    prompts
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            create_window(app)?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![run, init])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
