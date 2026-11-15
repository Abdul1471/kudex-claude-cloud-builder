import type {NextApiRequest,NextApiResponse} from "next";
import {getToken} from "next-auth/jwt";
import {dispatchClaudeWorkflow} from "@/lib/github";
const NAME=/^[A-Za-z0-9_.-]{1,100}$/;
const BRANCH=/^(?!\/)(?!.*\.\.)(?!.*\/\/)[A-Za-z0-9._/-]{1,120}(?<!\/)$/;
export default async function handler(req:NextApiRequest,res:NextApiResponse){
 res.setHeader("Cache-Control","no-store");
 if(req.method!=="POST"){res.setHeader("Allow","POST");return res.status(405).json({error:"Method not allowed."});}
 const configuredOrigin=process.env.NEXTAUTH_URL?new URL(process.env.NEXTAUTH_URL).origin:null;
 const requestOrigin=req.headers.origin;
 if(!configuredOrigin||!requestOrigin||requestOrigin!==configuredOrigin)return res.status(403).json({error:"Request origin could not be verified."});
 const token=await getToken({req,secret:process.env.NEXTAUTH_SECRET});
 if(!token?.accessToken||!token.login)return res.status(401).json({error:"Sign in with GitHub first."});
 const {owner,repo,task,ref="main"}=req.body??{};
 if(typeof owner!=="string"||typeof repo!=="string"||typeof task!=="string"||!NAME.test(owner)||!NAME.test(repo)||typeof ref!=="string"||!BRANCH.test(ref)||task.trim().length<12||task.length>4000)return res.status(400).json({error:"Provide a valid owner, repository, branch and task (12–4000 characters)."});
 if(owner.toLowerCase()!==String(token.login).toLowerCase())return res.status(403).json({error:"This first release only allows repositories owned by your signed-in GitHub account."});
 try{await dispatchClaudeWorkflow(String(token.accessToken),{owner,repo,task:task.trim(),ref});return res.status(202).json({accepted:true,message:"Workflow dispatched. Open the repository Actions tab to follow the run."});}
 catch(error){const message=error instanceof Error?error.message:"Unable to dispatch workflow.";return res.status(502).json({error:message});}
}
