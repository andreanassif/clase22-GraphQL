import express from "express";
import { buildSchema } from "graphql";
import {graphqlHTTP} from "express-graphql";

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const PORT = process.env.PORT || 8081;
app.listen(PORT,()=>console.log(`Server listening on port ${PORT}`));

//config graphQL

const graphQLSchema = buildSchema(`
    type User{
        id:Int,
        nombre:String,
        telefono:String
    }

    input UserInput{
        nombre:String,
        telefono:String
    }

    type Query{
        getUsers: [User],
        getUserById(id:Int): User
    }

    type Mutation{
        addUser(user:UserInput): User
    }
`)

//creamos los metodos

let users = [];

const root = {
    getUsers:()=>{
        return users
    },
    getUserById:({id})=>{
        const userFound = users.find(u=>u.id === id);
        if(!userFound){
            return null
        } else{
            return userFound
        }
    },

    addUser: ({user})=>{
        let newId;
        if(!users.length){
            newId=1
        } else{
            newId = users[users.length-1].id + 1
        }
        const newUser = {
            id:newId,
            nombre:user.nombre,
            telefono:user.telefono
        }
        users.push(newUser);
        return newUser;
    }
};

//enlazar el schema y los metodos con nuestro servidor

app.use("/graphiql", graphqlHTTP({
    schema: graphQLSchema, // schema de la api
    rootValue:root, //metodos
    graphiql:true, //habilita a grphql para querys
}))