use colored::*;
use std::{env, path::PathBuf, process::exit};

use crate::editor::Editor;

#[derive(Clone)]
pub struct Config {
    pub script_path: PathBuf,
    pub run_script: PathBuf,
    pub schema_script: PathBuf,
    pub template_script: PathBuf,
    pub editor: Editor,
}

impl Config {
    pub fn new() -> Self {
        let script_path = env::var("FLOWS_SCRIPT_PATH").unwrap_or_default();
        let editor_name = env::var("FLOWS_EDITOR").unwrap_or("vim".to_owned());
        let runner_dir = env::var("FLOWS_RUNNER_PATH").map_or_else(
            |_e| PathBuf::from(&script_path).join(".flows"),
            |p| PathBuf::from(p),
        );

        let run_script = runner_dir.join("run.ts");
        let schema_script = runner_dir.join("schema.ts");
        let template_script = runner_dir.join("template.ts");
        let editor = Editor::try_from(editor_name).unwrap_or_default();

        Config {
            script_path: PathBuf::from(script_path),
            run_script,
            schema_script,
            editor,
            template_script,
        }
    }

    pub fn validate(self) {
        if !self.script_path.exists() {
            println!(
                "{}",
                "Script path does not exists please set the \"FLOWS_SCRIPT_PATH\" environment"
                    .red()
            );
            exit(1);
        }
    }
}
