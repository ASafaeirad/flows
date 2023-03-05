extern crate swc_ecma_parser;
use serde_json;
use std::{collections::HashMap, path::Path};
use swc_common::sync::Lrc;
use swc_common::{
    errors::{ColorConfig, Handler},
    SourceMap,
};
use swc_ecma_ast::{
    Decl, Expr, Lit, Module, ModuleDecl, ModuleItem, ObjectLit, Pat, Prop, PropName, PropOrSpread,
};
use swc_ecma_parser::{lexer::Lexer, Parser, StringInput, Syntax};

type Prompts = Vec<HashMap<String, Vec<String>>>;

pub fn get_prompts(path: &Path) -> String {
    let prompts = parse(path);
    return serde_json::to_string(&prompts).unwrap();
}

fn parse(path: &Path) -> Prompts {
    let module = get_module(path);

    let mut prompts: Prompts = Vec::new();
    let module_item = get_schema(&module.body);
    let objects = get_objects(module_item);

    objects.into_iter().for_each(|item| {
        let prompt =
            item.props
                .into_iter()
                .flat_map(get_key_value)
                .fold(HashMap::new(), |mut acc, cur| {
                    acc.insert(cur.0, cur.1);
                    acc
                });
        prompts.push(prompt);
    });

    return prompts;
}

fn get_key_value(prop: PropOrSpread) -> Option<(String, Vec<String>)> {
    if let PropOrSpread::Prop(p) = prop {
        if let Prop::KeyValue(key_value) = *p {
            let mut key = String::new();
            if let PropName::Ident(ident) = key_value.key {
                key = String::from(&ident.sym as &str);
            }

            match *key_value.value {
                Expr::Lit(Lit::Str(str)) => {
                    return Some((key, vec![String::from(&str.value as &str)]));
                }
                Expr::Array(arr) => {
                    let mut values = Vec::with_capacity(arr.elems.len());

                    for elem in &arr.elems {
                        if let Some(x) = elem {
                            if let Expr::Lit(Lit::Str(str)) = &*x.expr {
                                values.push(String::from(&str.value as &str));
                            }
                        }
                    }

                    return Some((key, values));
                }
                _ => return None,
            }
        }
    }
    None
}

fn get_objects(module_item: ModuleItem) -> Vec<ObjectLit> {
    if let ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(x)) = module_item {
        if let Decl::Var(decl) = x.decl {
            if let Some(array_lit_box) = decl.decls[0].clone().init {
                if let Expr::Array(array_lit) = *array_lit_box {
                    let objects: Vec<ObjectLit> = array_lit
                        .elems
                        .into_iter()
                        .map(|x| {
                            if let Some(expr) = x {
                                if let Expr::Object(obj) = *expr.expr {
                                    return Some(obj);
                                }
                            }
                            None
                        })
                        .flatten()
                        .collect();
                    return objects;
                }
                return Vec::new();
            }
            return Vec::new();
        }
        return Vec::new();
    }
    return Vec::new();
}

fn get_schema(module: &Vec<ModuleItem>) -> ModuleItem {
    return module
        .into_iter()
        .filter(|x| {
            if let ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(x)) = x {
                if let Decl::Var(decl) = &x.decl {
                    if let Pat::Ident(_binding_ident) = &decl.decls[0].name {
                        return &_binding_ident.id.sym == "SCHEMA";
                    }
                }
                false
            } else {
                false
            }
        })
        .collect::<Vec<&ModuleItem>>()[0]
        .clone();
}

fn get_module(path: &Path) -> Module {
    let cm: Lrc<SourceMap> = Default::default();
    let handler = Handler::with_tty_emitter(ColorConfig::Auto, true, false, Some(cm.clone()));

    let fm = cm
        .load_file(path)
        .expect(&format!("failed to load {:?}", path));

    let lexer = Lexer::new(
        Syntax::Typescript(Default::default()),
        Default::default(),
        StringInput::from(&*fm),
        None,
    );
    let mut parser = Parser::new_from(lexer);

    for e in parser.take_errors() {
        e.into_diagnostic(&handler).emit();
    }

    parser
        .parse_module()
        .map_err(|e| e.into_diagnostic(&handler).emit())
        .expect("failed to parser module")
}
