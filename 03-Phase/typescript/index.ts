let x: number = 10;
let currentUser: string | null = "helj";
let userObj: object = {};

function add(x: number, y: number): number {
  return x + y;
}
let result: number = add(3, 4);
let result2 = add(3, 4);

function createUser(newUser: {
  firstName: string;
  lastName: string;
  email?: string;
}) {
  const trimedLastName = newUser.firstName.trim();
  // const trimedEmail = newUser.email.trim() // 'newUser.email' is possibly 'undefined'.
  const trimedEmail = newUser.email?.trim() // optional chaining
  if(newUser.email){
    newUser.email.trim()
  }
}

// interface is like mai ek khud ka type banara hu like blue print
interface User {
    firstName: string,
    lastName: string,
    email: string,
    avatar?: string
}

function updateUser(user: User) {
    user.firstName
}

// tsc --init
// tsc <file_name>