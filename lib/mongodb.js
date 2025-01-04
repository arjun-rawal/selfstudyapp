// import { MongoClient } from 'mongodb';

// const uri = process.env.MONGODB_URI;
// const options = {};

// let client;
// let clientPromise;

// if (!process.env.MONGO_URI) {
//   throw new Error('Please add your Mongo URI to .env.local');
// }

// if (process.env.NODE_ENV === 'development') {
//   if (!global._mongoClientPromise) {
//     client = new MongoClient(uri, options);
//     global._mongoClientPromise = client.connect();
//   }
//   clientPromise = global._mongoClientPromise;
// } else {
//   client = new MongoClient(uri, options);
//   clientPromise = client.connect();
// }
// export default clientPromise;





import { MongoClient } from 'mongodb';

// const uri = 'process.env.MONGO_URI'; //for Mr. Sea, use 'mongodb://localhost:27017'
const uri = 'mongodb+srv://arawal:arjun123@selfstudy.hlmyu.mongodb.net/?retryWrites=true&w=majority&appName=selfstudy';
const options = {};

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export default clientPromise;
// import { MongoClient } from "mongodb";

// if (!process.env.MONGO_URI) {
//   throw new Error('Invalid/Missing environment variable: "MONGO_URI"');
// }

// const uri = process.env.MONGO_URI;
// const options = {};

// let client;
// let isConnected = false;

// /**
//  * Returns a connected MongoClient instance.
//  */
// async function getMongoClient() {
//   if (!client) {
//     client = new MongoClient(uri, options);
//   }

//   if (!isConnected) {
//     await client.connect();
//     isConnected = true; // Mark the client as connected
//   }

//   return client; // Ensure this is an instance of MongoClient
// }

// export default getMongoClient;

// import { MongoClient } from "mongodb";

// if (!process.env.MONGO_URI) {
//   throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
// }

// const uri = process.env.MONGODB_URI;
// const options = { appName: "devrel.template.nextjs" };

// let client: MongoClient;

// // if (process.env.NODE_ENV === "development") {
//   // In development mode, use a global variable so that the value
//   // is preserved across module reloads caused by HMR (Hot Module Replacement).
//   let globalWithMongo = global as typeof globalThis & {
//     _mongoClient?: MongoClient;
//   };

//   if (!globalWithMongo._mongoClient) {
//     globalWithMongo._mongoClient = new MongoClient(uri, options);
//   }
//   client = globalWithMongo._mongoClient;
// // } else {
// //   // In production mode, it's best to not use a global variable.
// //   client = new MongoClient(uri, options);
// // }

// // Export a module-scoped MongoClient. By doing this in a
// // separate module, the client can be shared across functions.

// export default client;
