/** @jsxImportSource frog/jsx */

import { Button, Frog } from "frog";
import { handle } from "frog/vercel";
import nftAbi from "./nftAbi.json";
import { genImg } from "@/app/openai";

type State = {
	base: 'basil' | 'beet' | 'carrot' | 'tomato' | undefined;
	pasta: 'spaghetti' | 'bowtie' | 'fettuccine' | 'penne' | undefined;
	topping1: 'parmesan' | 'pine' | 'pecorino' | 'jalapeno' | undefined;
	topping2: 'parmesan' | 'pine' | 'pecorino' | 'jalapeno' | undefined;
	imgUrl: string;
}

const app = new Frog<{State: State}>({
	basePath: "/api",
	initialState: {
		pasta: undefined,
		base: undefined,
		topping1: undefined,
		topping2: undefined,
		imgUrl: "",
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
			<Button value="tomato">Sun-dried Tomato</Button>,
			<Button value="beet">Beet</Button>,
			<Button value="carrot">Carrot</Button>,
		],
	});
});

app.frame("/choose-pasta", (c) => {
	const { buttonValue, deriveState } = c
	const state = deriveState(previousState => {
		previousState.base = buttonValue as State['base']
	})

	return c.res({
		action: "/choose-topping1",
		image: (
			<div style={{ color: 'white', display: 'flex', fontSize: 60 }}>
			  Select your pasta (base = {state.base}):
			</div>
		  ),
		intents: [
			<Button value="spaghetti">Spaghetti</Button>,
			<Button value="bowtie">Bowtie</Button>,
			<Button value="penne">Penne</Button>,
			<Button value="fettuccine">Fettuccine</Button>,
		],
	});
});

app.frame("/choose-topping1", (c) => {
	const { buttonValue, deriveState } = c
	const state = deriveState(previousState => {
		previousState.pasta = buttonValue as State['pasta']
	})

	return c.res({
		action: "/choose-topping2",
		image: (
			<div style={{ color: 'white', display: 'flex', fontSize: 60 }}>
			  Select your first topping (base = {state.base}, pasta = {state.pasta}). All pesto comes with garlic, lemon, and olive oil.
			</div>
		  ),
		intents: [
			<Button value="parmesan">Parmesan</Button>,
			<Button value="pine">Pine Nuts</Button>,
			<Button value="pecorino">Pecorino Romano</Button>,
			<Button value="jalapeno">Jalapeno</Button>,
		],
	});
});

app.frame("/choose-topping2", (c) => {
	const { buttonValue, deriveState } = c
	const state = deriveState(previousState => {
		previousState.topping1 = buttonValue as State['topping1']
	})

	return c.res({
		action: "/pre-mint",
		image: (
			<div style={{ color: 'white', display: 'flex', fontSize: 60 }}>
			  Select your second topping (base = {state.base}, pasta = {state.pasta}, topping1 = {state.topping1}). All pesto comes with garlic, lemon, and olive oil.
			</div>
		  ),
		intents: [
			<Button value="parmesan">Parmesan</Button>,
			<Button value="pine">Pine Nuts</Button>,
			<Button value="pecorino">Pecorino Romano</Button>,
			<Button value="jalapeno">Jalapeno</Button>,
		],
	});
});

app.frame("/pre-mint", async (c) => {
	const { buttonValue, deriveState } = c
	const state = await deriveState(async previousState => {
		previousState.topping2 = buttonValue as State['topping2']
		previousState.imgUrl = await genImg(
			previousState.base!, 
			previousState.pasta!, 
			previousState.topping1!, 
			previousState.topping2!)
	})

	return c.res({
		action: "/mint-successful",
		image: (
			<div style={{ color: 'white', display: 'flex', fontSize: 60 }}>
			  <p>Mint your {state.base} {state.pasta} with {state.topping1} and {state.topping2} pesto:
			  </p>
			  <p>Image: {state.imgUrl}</p>
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
