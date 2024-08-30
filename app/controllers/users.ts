import jwt from "jsonwebtoken"
import {PrismaClient, users, role} from "@prisma/client"
import {jwt_secret} from "../../config.json"
const prisma = new PrismaClient();

const userController = {
    //Middlewares that are called before requests are handled
    validateRequest : async (req: any, res:any, next:any, roles: string[]) => {
        const {authorization} = req.headers;
        if(!authorization){
            return res.status(401).json({message : "No token provided"});
        }

        const token = authorization.split(' ')[1]; // Get the jwt token from header
        try {
            const decodedToken = jwt.verify(token, jwt_secret) as jwt.JwtPayload;
            
            //We check if the token expiration is defined and if it is less than the current date. We also check if the role is in the roles array.
            if (typeof decodedToken.exp !== "undefined" && decodedToken.exp < Date.now() && roles.includes(decodedToken.role)){
                req.userId = decodedToken.userId;
                next();
                return;
            } 
            else {
                return res.status(401).json({message : "Unauthorized"});
            }

        }
        catch(e){
            return res.status(500).json({message : "Unauthorized"});
        }
    },

    //Controller routes that are called when the request is handled

    login : async (req: any, res: any) => {

        //Check if email and password are provided
        const {email, password} = req.body;
        if (!email || !password){
            return res.status(400).json({message : "Email and password are required"});
        }

        const user = await prisma.users.findFirst({
            where : {
                email : email
            }
        });

        //Error handling for both not found user or server error if no jwt is generated
        if (!user || user.password !== password){
            return res.status(400).json({message : "Invalid email or password"});
        }

        const token = await userController.generateJwt(user);
        if (!token){
            return res.status(500).json({message : "Internal server error"});
        }

        return res.status(200).json({token : token});
    },

    register : async (req: any, res: any) => {
        const userType = req.params.userType; //Formatted as a /:param with in the route. Like post /users/:userType
        if (!userType){
            return res.status(400).json({message : "User type is required"});
        }

        //Defining roleId from userType and checking if it exists
        let roleId;
        if (userType === "user"){roleId = 1;}
        else if (userType === "botanist"){roleId = 2;}
        else if (userType === "administrator"){roleId = 3;}
        else {
            return res.status(400).json({message : "Invalid user type"});
        }

        //Check for all the required fields to create the user
        const {email, password, pseudo, ville, codePostal} = req.body
        if (!email || !password || !pseudo || !ville || !codePostal){
            return res.status(400).json({message : "missing fields in the request"});
        }

        //Check if the user already exists
        const testUser = await prisma.users.findFirst({
            where : {
                email : email
            }
        });

        if (testUser) {
            return res.status(400).json({message : "User already exists"});
        }

        //Create user and send the response
        let data = await prisma.users.create({
            data : {
                email : email,
                password : password,
                pseudo : pseudo,
                ville : ville,
                codePostal : codePostal,
                roleId : roleId
            },
            select :{
                id : true,
                password : true,
                email : true,
                pseudo : true,
                ville : true,
                codePostal : true,
                roleId : true,
                role: true
            }
        });
        res.status(200).json({...data, password : "hidden"}); 


    },
    
    getUser : async (req : any, res : any) => {
        try  {
        const userId = req.userId as number;
        
        //Finding user from ID and selecting specific fields
        const user = await prisma.users.findUnique({
            where : {
                id : userId
            },
            select : {
                id : true,
                email : true,
                pseudo : true,
                ville : true,
                codePostal : true,
                roleId : true,
                role : true
            }
        });

        //Error handling for user not found 
        if (!user){
            return res.status(404).json({message : "User not found"});
        }

       
        return res.status(200).json(user);

        }
        catch(e) {
            res.status(500).json({message : "Internal server error"});
        }
        

    },

    deleteUser : async (req : any, res : any) => {
        const userId = req.userId as number;
        const user = await prisma.users.delete({
            where : {
                id : userId
            }
        });
        return res.status(200).json({message : "User deleted"});
    },


    //utility functions that are called within routes themselves

    generateJwt : async (userObject : users) => {

        //Find Role of the user from the ID
        const roleObject = await prisma.role.findUnique({
            where : {
                id : userObject.roleId
            }
        })

        if (!roleObject){
            return null;
        }
        //Generate token if the role exists
        const token = jwt.sign({
            userId : userObject.id,
            role : roleObject.libelle
        }, jwt_secret, {
            expiresIn : "24h",
            issuer : "http://localhost:3000/users",
            subject : userObject.id.toString(),
        });

        return token;

    }
};

export default userController;