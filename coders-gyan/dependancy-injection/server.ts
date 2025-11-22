import app from './src/app';

const port = 3000;

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});

// dependency injection tools
// inversify -> https://github.com/inversify/InversifyJS?tab=readme-ov-file
// awilix -> https://github.com/jeffijoe/awilix
// typedi -> https://github.com/typestack/typedi

/*
    Dependency Injection is a design pattern where you give an object the things it needs (its dependencies) rather than having the object create them itself.
    
    Real-world analogy:
        Instead of making your own coffee at home (creating dependencies), you go to a café and someone hands you the coffee (injecting dependencies). You still get your coffee, but you didn't have to make it yourself.
*/