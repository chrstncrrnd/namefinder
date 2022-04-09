
#[tauri::command]
fn first_command() {
  println!("Hello, world!")
}

fn is_name_available(name: String){
  if name.len() < 4{
    println!("Error, {} is too short", name);
  }
  else if name.len() > 16{
    println!("Error, {} is too long", name)
  }
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![first_command])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
