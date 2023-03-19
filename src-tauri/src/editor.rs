use std::{
    io::{BufRead, BufReader},
    path::Path,
    process::Command,
    thread,
};

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
                editor: "nvim".to_owned(),
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
    pub fn edit_file<P: AsRef<Path>, T: 'static + Send + Fn(&str)>(
        self,
        file: P,
        cb: T,
    ) -> std::io::Result<()> {
        let EditorCmd { editor, args } = self.into();

        let child = Command::new(&editor)
            .args(&args)
            .arg(file.as_ref())
            .spawn()?;

        thread::spawn(move || {
            let f = child.stdout;
            if let Some(child) = f {
                let mut reader = BufReader::new(child);
                loop {
                    let mut buf = String::new();
                    match reader.read_line(&mut buf) {
                        Ok(_) => {
                            cb(buf.as_str());
                        }
                        Err(e) => println!("an error!: {:?}", e),
                    }
                }
            }
        });
        Ok(())
    }
}
