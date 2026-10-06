
// to run loop
// let a = 9;
// for(let i = 20 ; i >= a; i--){
//     console.log(i);
// }


//Print odd num
// let b= 15;
// for(let i=0 ;i < b ; i++ ){
//     if(i % 2 != 0 ){
//         console.log(i)
//     }
// }


//Print even num
// let b= 15;
// for(let i=0 ;i < b ; i++ ){
//     if(i % 2 == 0 ){
//         console.log(i)
//     }
// }

//nestd loop
// for(let i = 0 ; i <= 5 ; i++){
//     let row = "";
//     for(let j = 1; j <= i; j++){
//         row += "*";
//     }
//     console.log(row);
// }

//while-loop
// let i = 1;
// while(i <= 10){
//     console.log("You are cool" ,i);
//     i++ ;
// }

//Loop with array
// let arr = [2,3,4,1,5,6,18];
// let n = arr.length;
// for(let i = 0; i < n; i++){
//     console.log(arr[i]);
// }

//nested array loop
// let arr = [["King","Virat"],["Kohli","Pak-Abbu"]];
// let n = arr.length;
// for(let i = 0; i < n; i++){
//     console.log(`Name #${i}`);
//     for(let j = 0; j<n;j++){
//         console.log(arr[i][j]);
//     }
// }

let num = [["Aman", 95],["Nishnak", 96],["Krishn", 99]];
let n = num.length;

for(let i = 0 ; i < n ; i++){
    console.log(`num #${i}`);
    for(let j = 0 ; j < n ; j++){
        console.log(num[i][j]);
    }
}

