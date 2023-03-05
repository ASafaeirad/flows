#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::{error::Error, path::PathBuf, process::Command};

#[tauri::command]
fn run(args: &str) -> String {
    let loc = std::env::var("FLOWS_SCRIPT_PATH").expect("");
    let script = "test.ts";
    let mut path = PathBuf::from(loc);
    let mut run = std::env::current_dir().expect("Cannot");
    run.pop();
    run.push("runner");
    run.push("run.ts");
    path.push(script);
    let mut child = Command::new(run)
        .args([path.to_str().unwrap(), args])
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
    let script = "test.ts";
    let mut path = PathBuf::from(loc);
    path.push(script);

    let mut schema = std::env::current_dir().expect("Cannot");
    schema.pop();
    schema.push("runner");
    schema.push("schema.ts");

    let output = Command::new(schema)
        .arg(path)
        .output()
        .expect("failed to execute child");
    let stdout = String::from_utf8_lossy(&output.stdout).to_string();

    stdout
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
