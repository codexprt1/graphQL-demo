const express = require("express");
const app = express();

const port = 4500;
const { graphqlHTTP } = require("express-graphql");

const schema = require("./schema");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use("/", (req, res) => {
// 	res.json({
// 		success: true,
// 		message: "GraphQL works fine",
// 	});
// });

app.use(
	"/graphql-demo",
	graphqlHTTP({
		schema,
		graphiql: true,
	})
);

app.listen(port, () => {
	console.log(`server started at http://localhost:${port}`);
});
