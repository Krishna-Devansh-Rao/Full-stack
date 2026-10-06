let btn = document.querySelector("button");
let ol = document.querySelector("ol");
let input = document.querySelector("input");

// Existing delete buttons
let delBtns = document.querySelectorAll(".delete");

for (let delBtn of delBtns) {
    delBtn.addEventListener("click", function () {
        this.parentElement.remove();
    });
}


// Add new item
btn.addEventListener("click", function () { 
    let item = document.createElement("li");    
    item.innerText = input.value;   
    let delBtn = document.createElement("button");  
    delBtn.innerText = "Delete";    
    delBtn.classList.add("delete"); 
    // Listener for newly created button
    delBtn.addEventListener("click", function () {
        this.parentElement.remove();
    }); 
    item.appendChild(delBtn);   
    ol.appendChild(item);   
    input.value = "";
});