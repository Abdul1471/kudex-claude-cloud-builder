import type { Config } from "tailwindcss";
const config: Config = { content:["./pages/**/*.{js,ts,jsx,tsx}","./components/**/*.{js,ts,jsx,tsx}"],theme:{extend:{colors:{ink:"#090b12",panel:"#111522",line:"#242b3b",muted:"#8c96aa",accent:"#9b8cff",mint:"#5eead4"}}},plugins:[]};
export default config;
