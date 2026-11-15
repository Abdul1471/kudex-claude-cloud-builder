const API="https://api.github.com";
export async function dispatchClaudeWorkflow(accessToken:string,input:{owner:string;repo:string;task:string;ref:string}):Promise<void>{
 const headers={Authorization:`Bearer ${accessToken}`,Accept:"application/vnd.github+json","X-GitHub-Api-Version":"2022-11-28","Content-Type":"application/json"};
 const url=`${API}/repos/${encodeURIComponent(input.owner)}/${encodeURIComponent(input.repo)}`;
 const check=await fetch(url,{headers,cache:"no-store"});
 if(!check.ok)throw new Error(check.status===404?"Repository not found or not accessible.":"GitHub could not verify repository access.");
 const data=await check.json() as {owner?:{login?:string};permissions?:{push?:boolean;admin?:boolean}};
 if(data.owner?.login?.toLowerCase()!==input.owner.toLowerCase())throw new Error("Repository owner verification failed.");
 if(!data.permissions?.push&&!data.permissions?.admin)throw new Error("You need push access to dispatch a coding job.");
 const endpoint=`${url}/actions/workflows/claude-cloud-builder.yml/dispatches`;
 const response=await fetch(endpoint,{method:"POST",headers,body:JSON.stringify({ref:input.ref,inputs:{task:input.task}}),cache:"no-store"});
 if(response.status===204)return;
 const detail=await response.text();
 if(response.status===404)throw new Error("Workflow not found. Ensure claude-cloud-builder.yml is on the default branch and Actions are enabled.");
 if(response.status===422)throw new Error("GitHub rejected the dispatch. Check the branch and workflow_dispatch configuration.");
 throw new Error(`GitHub workflow dispatch failed (${response.status}): ${detail.slice(0,240)}`);
}
