import NextAuth from "next-auth/next";
import GoogleProvider from 'next-auth/providers/google';
const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
console.log("client_id",clientId)

if (!clientId || !clientSecret) {
    throw new Error("Missing Google Client ID or Client Secret");
}


const authOptions ={
    providers:[
        GoogleProvider({
            clientId,
            clientSecret,
        })
    ]
};

const handler= NextAuth(authOptions);

export {handler as GET,handler as POST};