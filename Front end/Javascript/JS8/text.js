// let arr = [1,2,3,4,5];

// arr.forEach((el) => {
    //     console.log(el);
    // });
    
// let arr = [1,2,3,4,5];
// let num = arr.filter((el) => {
//     return el < 5;
// });

// Find the max of array

let nums = [2,3,5,6,7,8,9,2,3,11];

let result = nums.reduce( (max,el) => {
    if( el > max){
        return el;
    }
    else{
        return max ;
    }
});

