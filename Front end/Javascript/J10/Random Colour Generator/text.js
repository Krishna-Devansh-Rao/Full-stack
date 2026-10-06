let btn = document.querySelector("button");
btn.addEventListener("click",function(){
    console.log("Generate Random colour");
    let h4 = document.querySelector("h4");
    let randomColor = getRandomColor();
    h4.innerText = randomColor ;
    let div = document.querySelector("div");
    div.style.backgroundColor = randomColor;
    console.log("Colour updated");
});
function getRandomColor(){
    let red = Math.floor(Math.random() * 255);
    let green = Math.floor(Math.random() * 255);
    let blue = Math.floor(Math.random() * 255);
    let color = `rgb(${red},${green},${blue})` ;
    return color;
}


//This function
