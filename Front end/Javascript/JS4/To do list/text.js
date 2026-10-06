function startTodo() {

    let todo = [];

    while (true) {
    let request = prompt(
        "Enter command: add, delete, list, quit"
    );
    if (request === "quit") {
        console.log("Quitting...");
        break;
    }
    else if (request === "add") {
        let task = prompt("Enter your task:");
        todo.push(task);
        console.log("Task added!");
    }
    else if (request === "list") {
        console.log("Your Tasks:");
        for (let task of todo) {
            console.log(task);
        }
    }
    else if (request === "delete") {
        let task = prompt("Enter the task to delete:");
        let index = todo.indexOf(task);
        if (index !== -1) {
            todo.splice(index, 1);
            console.log("Task deleted!");
        } else {
            console.log("Task not found!");
        }
    }
    else {
            
            console.log("Invalid command!");

        }
    }
}