const { Wallet } = require("ethers");
const fs = require("fs");
require("dotenv").config();

(async ()=>{
  const msg = fs.readFileSync("siwe-trimmed.txt","utf8");
  const wallet = new Wallet(process.env.PRIVATE_KEY);
  const sig = await wallet.signMessage(msg);
  console.log(sig);
})();
