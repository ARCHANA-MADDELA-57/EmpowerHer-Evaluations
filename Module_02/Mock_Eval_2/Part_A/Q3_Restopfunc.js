const sumAll = (...numbers) =>{
    return numbers.reduce((accumulator,currentValue)=> accumulator+currentValue,0);
};
console.log(sumAll(1,2,3,4));
console.log(sumAll(10,20))