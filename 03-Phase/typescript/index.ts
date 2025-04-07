let x: number = 10;
let user: string | null = "helj";
let userObj: object = {};

function add(x: number, y: number): number {
  return x + y;
}
let result: number = add(3, 4);
let result2 = add(3, 4);

function createUser(user: {
  firstName: string;
  lastName: string;
  email?: string;
}) {
  const trimedLastName = user.firstName.trim();
  // const trimedEmail = user.email.trim() // 'user.email' is possibly 'undefined'.
  const trimedEmail = user.email?.trim() // optional chaining
  if(user.email){
    user.email.trim()
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