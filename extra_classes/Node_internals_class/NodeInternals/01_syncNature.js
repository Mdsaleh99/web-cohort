function one(){
    for( let i =0 ; i< 2000000000; i++){}
    console.log('one')
}
function two(){
    console.log('two')
}

two();
one();