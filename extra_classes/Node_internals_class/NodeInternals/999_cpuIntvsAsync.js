import bcrypt from "bcryptjs"

setTimeout(()=>console.log("Timeout Called"),0)
async function hashPassword(password) {
    return await bcrypt.hash(password,10);
}

hashPassword("123456").then((val)=>console.log(val))