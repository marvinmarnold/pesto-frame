/** @jsxImportSource frog/jsx */

import { Button, Frog } from "frog";
import { handle } from "frog/vercel";
import nftAbi from "./nftAbi.json";

const app = new Frog({
	basePath: "/api",
});

app.frame("/", (c) => {
	return c.res({
		action: "/finish",
		image: "https://dweb.mypinata.cloud/ipfs/QmSYN7KT847Nado3fxFafYZgG6NXTMZwbaMvU9jhu5nPmJ",
		imageAspectRatio: "1:1",
		intents: [<Button.Transaction target="/mint">Mint</Button.Transaction>],
	});
});

app.frame("/finish", (c) => {
	return c.res({
		image: "https://dweb.mypinata.cloud/ipfs/QmUx3kQH4vR2t7mTmW3jHJgJgJGxjoBsMxt6z1fkZEHyHJ",
		imageAspectRatio: "1:1",
	});
});

app.transaction("/mint", (c) => {
	return c.contract({
		abi: nftAbi,
		chainId: "eip155:84532",
		functionName: "mint",
		to: "0x8e51c3cdd9dB0c4E6714c1C48cDA44F1d4c88D59",
	});
});

export const GET = handle(app);
export const POST = handle(app);
