

This response provides a modular and robust Express.js server using ES6 features, emphasizing best practices, error handling, and scalability.

**File Structure:**

```
express-server/
├── app.js          // Main application file
├── src/
│   ├── controllers/
│   │   └── users.js  // Example controller
│   ├── routes/
│   │   └── users.js  // Example routes
│   ├── middleware/
│   │   └── errorHandler.js // Custom error handler
│   └── db/
│       └── index.js // Database connection (example: MongoDB)
└── package.json     // Dependencies and scripts
```

**1. `package.json`:**

```json
{
  "name": "express-es6-server",
  "version": "1.0.0",
  "description": "Express server with ES6 features",
  "main": "app.js",
  "type": "module", // Crucial for ES modules
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js" // Requires nodemon: npm install -g nodemon
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongodb": "^5.6.0" //Example Database Driver, replace as needed.
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

**2. `app.js` (Main Application):**

```javascript
import express from 'express';
import userRoutes from './src/routes/users.js';
import dbConnect from './src/db/index.js';  //Database connection
import errorHandler from './src/middleware/errorHandler.js';

const app = express();
const port = process.env.PORT || 3000;


//Middleware to parse JSON body
app.use(express.json());


//Database connection
dbConnect();

//Routes
app.use('/users', userRoutes);

// Error handling middleware should always be last
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

```

**3. `src/routes/users.js`:**

```javascript
import express from 'express';
import * as userController from '../controllers/users.js';

const router = express.Router();


//Example Routes.  Replace with your actual routes.
router.get('/', userController.getUsers);
router.post('/', userController.createUser);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);


//Error Handling for routes (optional, can be centralized)
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

export default router;
```

**4. `src/controllers/users.js`:**

```javascript
//Example Controller functions. Replace with your actual logic.
import User from '../models/user.js'; // Assuming you have a User model


export const getUsers = async (req, res, next) => {
    try{
        const users = await User.find({});
        res.json(users);
    } catch(error){
        next(error); // Pass error to the error handler
    }
};


export const getUserById = async (req, res, next) => {
    try{
        const user = await User.findById(req.params.id);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch(error){
        next(error);
    }
};

//Add other controller functions (createUser, updateUser, deleteUser etc.)  similarly

```

**5. `src/middleware/errorHandler.js`:**

```javascript
export default (err, req, res, next) => {
    console.error(err.stack); // Log the error for debugging
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).json({ message });
};
```

**6. `src/db/index.js` (Example MongoDB connection):**

```javascript
import mongoose from 'mongoose';


const dbConnect = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mydatabase'); //Replace with your DB URI
        console.log('Connected to MongoDB');
    } catch(error){
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); //Exit if db connection fails.
    }
}

export default dbConnect;
```


**7. `src/models/user.js` (Example User Model):**

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  //Add other fields as needed.
});

const User = mongoose.model('User', userSchema);

export default User;
```

Remember to install the required packages:  `npm install express mongodb mongoose`


This comprehensive example demonstrates a well-structured Express.js server using ES6 modules,  incorporating error handling, modular design, and database connectivity.  Remember to replace placeholder database details and routes with your application's specific requirements.  Always handle potential errors during database interactions and other asynchronous operations.
