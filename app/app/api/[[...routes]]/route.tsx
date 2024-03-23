/** @jsxImportSource frog/jsx */

import { Button, Frog } from "frog";
import { handle } from "frog/vercel";
import nftAbi from "./nftAbi.json";

type State = {
	pasta: 'spaghetti' | 'bowtie' | 'fettuccine' | 'penne' | undefined;
	base: 'basil' | 'beet' | 'carrot' | 'tomato' | undefined;
}

const app = new Frog<{State: State}>({
	basePath: "/api",
	initialState: {
		pasta: undefined,
		base: undefined
	}
});


app.frame("/", (c) => {
	return c.res({
		action: "/choose-pasta",
		image: (
			<div style={{ color: 'white', display: 'flex', fontSize: 60 }}>
			  Select your base:
			</div>
		  ),
		intents: [
			<Button value="basil">Basil</Button>,
			<Button value="beet">Beet</Button>
		],
	});
});

app.frame("/choose-pasta", (c) => {
	const { buttonValue, deriveState } = c
	const state = deriveState(previousState => {
		previousState.base = buttonValue as State['base']
	})

	return c.res({
		action: "/pre-mint",
		image: (
			<div style={{ color: 'white', display: 'flex', fontSize: 60 }}>
			  Select your pasta (base = {state.base}):
			</div>
		  ),
		intents: [
			<Button value="spaghetti">Spaghetti</Button>,
			<Button value="bowtie">Bowtie</Button>
		],
	});
});

app.frame("/pre-mint", (c) => {
	const { buttonValue, deriveState } = c
	const state = deriveState(previousState => {
		previousState.pasta = buttonValue as State['pasta']
	})

	return c.res({
		action: "/mint-successful",
		image: (
			<div style={{ color: 'white', display: 'flex', fontSize: 60 }}>
			  Mint your {state.base} {state.pasta} pesto NFT:
			</div>
		  ),
		  intents: [<Button.Transaction target="/mint">Mint</Button.Transaction>],
	});
});

app.frame("/mint-successful", (c) => {
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
