console.log('hello world');
dict = {'msg':null}

try {
    if (!dict['msg']){
        console.log('null')
    }
} catch(error) {
    console.log(error, 'error')
}