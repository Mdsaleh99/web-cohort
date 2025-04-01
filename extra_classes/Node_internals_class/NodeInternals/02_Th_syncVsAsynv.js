import crypto from 'crypto'

const calls = 4;

const startTime = Date.now();
crypto.pbkdf2Sync("password", "salt", 100000, 512, "sha512") //900
crypto.pbkdf2Sync("password", "salt", 100000, 512, "sha512") 
crypto.pbkdf2Sync("password", "salt", 100000, 512, "sha512") 
crypto.pbkdf2Sync("password", "salt", 100000, 512, "sha512")
// console.log(`MainThread: `, Date.now()-startTime)

// setTimeout(()=>console.log("Timeout Called"),0)
for( let i =0;i< calls; i++){
    crypto.pbkdf2("password", "salt", 100000, 512, "sha512", ()=>{
        console.log(`ThreadPool: ${i+1}`, Date.now() - startTime);
    })
}


