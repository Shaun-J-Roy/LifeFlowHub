const fs=require('fs');
const path='Random.txt';
const readline=require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});
console.log("1. Open file");
console.log("2. Write to file");
console.log("3. Read file");
console.log("4. Delete file");
readline.question("Enter your choice(1-5): ",(choice)=>{
  choice=parseInt(choice); 
  switch(choice) {
    case 1: 
      fs.open(path, 'r',(err, fd)=>{
        if(err) {
          console.error("Error opening file:", err);
        } else {
          console.log("File opened successfully!");
          fs.close(fd,(err)=>{
            if(err) console.error("Error closing file:", err);
            else console.log("File closed successfully!");
          });
        }
        readline.close();
      });
      break;

    case 2: 
      readline.question("Enter text to write to the file: ",(text)=>{
        fs.writeFile(path, text,(err)=>{
          if(err) console.error("Error writing file:", err);
          else console.log("File written successfully!");
          readline.close();
        });
      });
      break;

    case 3: 
      fs.readFile(path, 'utf8',(err, data)=>{
        if(err) console.error("Error reading file:", err);
        else console.log("File data:", data);
        readline.close();
      });
      break;

    case 4: 
      fs.rm(path,(err)=>{
        if(err) console.error("Error deleting file:", err);
        else console.log("File deleted successfully!");
        readline.close();
      });
      break;

    default:
      console.log("Invalid choice! Please enter a number between 1 and 5.");
      readline.close();
  }
});