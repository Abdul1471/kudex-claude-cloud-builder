import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
export const authOptions: NextAuthOptions = {
 providers:[GitHubProvider({clientId:process.env.GITHUB_ID??"",clientSecret:process.env.GITHUB_SECRET??"",authorization:{params:{scope:"read:user user:email repo workflow"}}})],
 session:{strategy:"jwt",maxAge:8*60*60},
 callbacks:{async jwt({token,account,profile}){if(account?.access_token)token.accessToken=account.access_token;const p=profile as {login?:string}|undefined;if(p?.login)token.login=p.login;return token;},async session({session,token}){if(session.user)session.user.login=String(token.login??token.name??"");return session;}},
 pages:{signIn:"/"}
};
