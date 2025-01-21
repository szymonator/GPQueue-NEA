const callback = []
let temp = []
for (let n = 0; n<(callback.length/3); n++) {
    temp.push(callback.slice(n*3,3*n+3))
}

console.log(temp[0])