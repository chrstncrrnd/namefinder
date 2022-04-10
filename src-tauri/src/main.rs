#[tauri::command]
fn log(a: String){
  println!("{}", a);
}

#[tauri::command]
async fn is_name_available(name: String) -> bool{
  let request = reqwest::get(format!("https://api.mojang.com/users/profiles/minecraft/{}", name)).await.unwrap();
  let json = request.text().await.unwrap();
  if json.is_empty(){
    // return name is available true
    return true
  }
  else{
    return false
  }

}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![log, is_name_available])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
