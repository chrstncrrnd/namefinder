#[tauri::command]
fn log(a: String){
  println!("{}", a);
}

async fn is_name_available(name: &String) -> bool{
  let request = reqwest::get(format!("https://api.mojang.com/users/profiles/minecraft/{}", *name)).await.unwrap();
  let json = request.text().await.unwrap();
  return json.is_empty();

}
#[tauri::command]
async fn run(names: Vec<String>) -> Vec<String>{
  let mut out: Vec<String> = Vec::new();
  for name in names.iter(){
    if is_name_available(name).await{
      out.push(name.clone());
    }
  }
  out
}


fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![log, run])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
