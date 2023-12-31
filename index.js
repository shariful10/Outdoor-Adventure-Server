const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
const corsOptions = {
	origin: "*",
	credentials: true,
	optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bq2ef3t.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

async function run() {
	try {
		const usersCollection = client.db("autdoorDb").collection("users");
		const messageCollection = client.db("autdoorDb").collection("message");

		// post outdoor-adventure user message data
		app.post("/user", async (req, res) => {
			const user = req.body;
			const query = { email: user.email };

			const existingUser = await usersCollection.findOne(query);

			if (existingUser) {
				return res.send({ message: " user already exists" });
			}
			console.log(user);
			const result = await usersCollection.insertOne(user);
			res.send(result);
		});

		app.post("/messageUser", async (req, res) => {
			const messageData = req.body;
			console.log(messageData);
			const result = await messageCollection.insertOne(messageData);
			res.send(result);
		});

		// Send a ping to confirm a successful connection
		await client.db("admin").command({ ping: 1 });
		console.log(
			"Pinged your deployment. You successfully connected to MongoDB!"
		);
	} finally {
		// await client.close();
	}
}
run().catch(console.dir);

app.get("/", (req, res) => {
	res.send("Autdoor Adventure Server is running...");
});

app.listen(port, () => {
	console.log(`Autdoor Adventure Server is running on port ${port}`);
});
