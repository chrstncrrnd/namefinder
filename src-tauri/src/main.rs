use std::ops::Index;
use futures::future::join_all;

#[tauri::command]
fn log(a: String){
  println!("{}", a);
}

async fn is_name_available(name: &String) -> bool{
  let request = reqwest::get(format!("https://api.mojang.com/users/profiles/minecraft/{}", *name)).await.unwrap();
  let json = request.text().await.unwrap();
  let result = json.is_empty();
  result
}

#[tauri::command]
async fn run(names: Vec<String>) -> Vec<String>{
  let inputs = names.iter().map(|n| is_name_available(n));

  let bool_outputs = join_all(inputs).await;

  let mut output = Vec::new();

  // tried using something better like .filter but it was a pain to get working
  for (index, item) in names.into_iter().enumerate(){
    if bool_outputs[index]{
      output.push(item)
    }
  }

  output
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![log, run])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
