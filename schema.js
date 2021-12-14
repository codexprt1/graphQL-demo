const graphql = require("graphql");

const {
	GraphQLInt,
	GraphQLObjectType,
	GraphQLSchema,
	GraphQLString,
	GraphQLList,
	GraphQLNonNull,
} = graphql;

const authors = [
	{ id: 1, name: "J. K. Rowling" },
	{ id: 2, name: "J. R. R. Tolkien" },
	{ id: 3, name: "Brent Weeks" },
];

const books = [
	{ id: 1, name: "Harry Potter and the Chamber of Secrets", authorId: 1 },
	{ id: 2, name: "Harry Potter and the Prisoner of Azkaban", authorId: 1 },
	{ id: 3, name: "Harry Potter and the Goblet of Fire", authorId: 1 },
	{ id: 4, name: "The Fellowship of the Ring", authorId: 2 },
	{ id: 5, name: "The Two Towers", authorId: 2 },
	{ id: 6, name: "The Return of the King", authorId: 2 },
	{ id: 7, name: "The Way of Shadows", authorId: 3 },
	{ id: 8, name: "Beyond the Shadows", authorId: 3 },
];

const BookType = new GraphQLObjectType({
	name: "Book",
	description: "description of book",
	fields: () => ({
		id: { type: GraphQLInt },
		name: { type: GraphQLString },
		authorId: { type: GraphQLInt },
		author: {
			type: AuthorType,
			resolve: (parent, args) => {
				return authors.find((author) => author.id === parent.authorId);
			},
		},
	}),
});

const AuthorType = new GraphQLObjectType({
	name: "Author",
	description: "description of author",
	fields: () => ({
		id: { type: GraphQLInt },
		name: { type: GraphQLString },
		books: {
			type: new GraphQLList(BookType),
			resolve: (author) => {
				return books.filter((book) => book.authorId === author.id);
			},
		},
	}),
});

const RootQuery = new GraphQLObjectType({
	name: "Query",
	description: "Root Query",
	fields: () => ({
		book: {
			type: BookType,
			description: "A Single book",
			args: {
				id: { type: GraphQLInt },
			},
			resolve: (parent, args) => books.find((book) => book.id === args.id),
		},
		books: {
			type: new GraphQLList(BookType),
			description: "List of all books",
			resolve: () => books,
		},
		author: {
			type: AuthorType,
			description: "A Single author",
			args: {
				id: { type: GraphQLInt },
			},
			resolve: (parent, args) =>
				authors.find((author) => author.id === args.id),
		},
		authors: {
			type: new GraphQLList(AuthorType),
			description: "List of all author",
			resolve: () => authors,
		},
	}),
});

const RootMutationType = new GraphQLObjectType({
	name: "Mutation",
	description: "Root Mutation",
	fields: () => ({
		addBook: {
			type: BookType,
			description: "Add a book",
			args: {
				name: { type: GraphQLString },
				authorId: { type: GraphQLInt },
			},
			resolve: (parent, args) => {
				const book = {
					id: books.length + 1,
					name: args.name,
					authorId: args.authorId,
				};
				books.push(book);
				return book;
			},
		},
	}),
});

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: RootMutationType,
});
