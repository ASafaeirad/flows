use anyhow::Result;
use std::process::Output;

pub fn output_to_result(output: Result<Output, std::io::Error>) -> Result<String, String> {
    match output {
        Ok(o) => {
            if o.status.success() {
                Ok(String::from_utf8_lossy(&o.stdout).to_string())
            } else {
                Err(String::from_utf8_lossy(&o.stderr).to_string())
            }
        }
        Err(e) => Err(e.to_string()),
    }
}
