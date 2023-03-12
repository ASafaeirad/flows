use std::{path::Path, process::{Command, Stdio}, io::ErrorKind};

struct EditorCmd {
    editor: String,
    args: Vec<String>,
}

#[derive(Clone)]
pub enum Editor {
    Vim(Vec<String>),
    VSCode(Vec<String>),
}

impl TryFrom<String> for Editor {
    type Error = anyhow::Error;

    fn try_from(value: String) -> Result<Self, Self::Error> {
        if value == "vim" {
            Ok(Editor::Vim(Vec::new()))
        } else if value == "code" {
            Ok(Editor::VSCode(vec!["-w".to_owned()]))
        } else {
            Err(anyhow::format_err!("Editor is not supported"))
        }
    }
}

impl Into<EditorCmd> for Editor {
    fn into(self) -> EditorCmd {
        match self {
            Editor::Vim(args) => EditorCmd {
                editor: "vim".to_owned(),
                args,
            },
            Editor::VSCode(args) => EditorCmd {
                editor: "code".to_owned(),
                args,
            },
        }
    }
}

impl Default for Editor {
    fn default() -> Self {
        Editor::Vim(Vec::new())
    }
}

impl Editor {
    pub fn edit_file<P: AsRef<Path>>(self, file: P) -> std::io::Result<()> {
        let EditorCmd { editor, args } = self.into();
        println!("{:#?}", file.as_ref());

        let status = Command::new(&editor)
            .args(&args)
            .arg(file.as_ref())
            .stdin(Stdio::inherit())
            .stdout(Stdio::inherit())
            .stderr(Stdio::inherit())
            .output()?
            .status;

        if status.success() {
            Ok(())
        } else {
            let full_command = if args.is_empty() {
                format!("{} {}", editor, file.as_ref().to_string_lossy())
            } else {
                format!("{} {:?} {}", editor, args, file.as_ref().to_string_lossy())
            };

            Err(std::io::Error::new(
                ErrorKind::Other,
                format!("editor '{}' exited with error: {}", full_command, status),
            ))
        }
    }
}
