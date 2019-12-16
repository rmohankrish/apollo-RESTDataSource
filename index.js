import { ApolloServer, gql } from 'apollo-server-express';
import 'dotenv/config';
import express from 'express';
import cors from 'cors';

//API
import { PostAPI } from './post';

//books dataarray
const books = [
    {
        title: 'Harry potter and the chamber of Secrets',
        author: 'J K Rowling'
    },
    {
        title: 'Jurassic Park',
        author: 'Michael Crichton'
    }
];

//TypeDefs
const typeDefs = gql `
    type Book {
        title: String
        author: String
    }

    type Post {
        id: ID
        title: String
        body: String
        userId: ID
    }

    type Query {
        books: [Book]
        post(id: Int): Post
        posts: [Post]
    }

    type Mutation {
        addPost(title: String, body: String, userId: Int): Post
    }
`;

//resolvers
const resolvers = {
    Query: {
        books: () => books,
        post: async(_source, { id }, { dataSources }) => {
            return dataSources.postAPI.getPost(id);
        },
        posts: async(_source, _args, { dataSources }) => {
            return dataSources.postAPI.getPosts();
        }
    },
    Mutation: {
        addPost: (parent, args, { dataSources }) => {
            const post = {};
            post['title'] = args.title;
            post['body'] = args.body;
            post['userId'] = args.userId;
            return dataSources.postAPI.newPost(post);
        }
    }
};

const app = express();

app.use(cors());

const server = new ApolloServer({ 
                    typeDefs, 
                    resolvers,
                    dataSources: () => {
                        return {
                            postAPI: new PostAPI(),
                        };
                    } 
                });

server.applyMiddleware({ app, path: process.env.APP_URL});

app.listen({ port: process.env.APP_PORT, host: process.env.APP_HOST }, () => {
    console.log('Apollo Server running on ' + process.env.APP_PORT + process.env.APP_URL);
});
