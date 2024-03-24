/** @jsxImportSource frog/jsx */

import { Button, Frog } from "frog";
import { handle } from "frog/vercel";
import { imgToIPFS } from "./openaiToIpfs";
import pestoBowlAbi from "./pestoBowlAbi.json";
import { getBaseUrl } from "@/app/lib";

type State = {
	base: 'basil' | 'beet' | 'carrot' | 'tomato' | undefined;
	pasta: 'spaghetti' | 'bowtie' | 'fettuccine' | 'penne' | undefined;
	topping1: 'parmesan' | 'pine' | 'pecorino' | 'jalapeno' | undefined;
	topping2: 'parmesan' | 'pine' | 'pecorino' | 'jalapeno' | undefined;
	openAiJobId: string | undefined;
	ipfsUri: string | undefined;
	ipfsGatewayUrl: string | undefined;
}

const app = new Frog<{ State: State }>({
	basePath: "/api",
	initialState: {
		pasta: undefined,
		base: undefined,
		topping1: undefined,
		topping2: undefined,
		openAiJobId: undefined,
		ipfsUri: undefined,
		ipfsGatewayUrl: undefined,
	}
});

app.frame("/", (c) => {
	return c.res({
		action: "/choose-pasta",
		image: (
			<div style={{ color: "white", display: "flex", fontSize: 60 }}>
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
	const { buttonValue, deriveState } = c;
	const state = deriveState((previousState) => {
		previousState.base = buttonValue as State["base"];
	});

	return c.res({
		action: "/choose-topping1",
		image: (
			<div style={{ color: "white", display: "flex", fontSize: 60 }}>
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
	const { buttonValue, deriveState } = c;
	const state = deriveState((previousState) => {
		previousState.pasta = buttonValue as State["pasta"];
	});

	return c.res({
		action: "/choose-topping2",
		image: (
			<div style={{ color: "white", display: "flex", fontSize: 60 }}>
				Select your first topping (base = {state.base}, pasta ={" "}
				{state.pasta}). All pesto comes with garlic, lemon, and olive
				oil.
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
	const { buttonValue, deriveState } = c;
	const state = deriveState((previousState) => {
		previousState.topping1 = buttonValue as State["topping1"];
	});

	return c.res({
		action: "/prepare-img",
		image: (
			<div style={{ color: "white", display: "flex", fontSize: 60 }}>
				Select your second topping (base = {state.base}, pasta ={" "}
				{state.pasta}, topping1 = {state.topping1}). All pesto comes
				with garlic, lemon, and olive oil.
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

app.frame("/prepare-img", async (c) => {
	const { buttonValue, deriveState } = c
	let state = await deriveState(async previousState => {
		previousState.topping2 = buttonValue as State['topping2']
	})

	// invoke /api/img/create
	const url = getBaseUrl() + "api/image/create-job"
	const response = await fetch(url, {
		method: "POST",
		body: JSON.stringify({
			base: state.base!, 
			pasta: state.pasta, 
			topping1: state.topping1, 
			topping2: state.topping2
		})
	})

	const { jobId } = await response.json()
	// const jobId = "uuid-1234-5678-91011-12131415161718" 
	
	// save jobId to state
	state = await deriveState(async previousState => {
		previousState.openAiJobId = jobId as State['openAiJobId']
	})


	return c.res({
		action: "/refresh-img",
		image: (
			<div style={{ color: 'white', display: 'flex', fontSize: 60 }}>
			  <p>Check status for your {state.base} {state.pasta} with {state.topping1} and {state.topping2} pesto:
			  </p>
			</div>
		  ),
		  intents: [<Button value="refresh">Refresh</Button>],
	});
});

app.frame("/refresh-img", async (c) => {
	const { deriveState } = c
	const state = deriveState(previousState => {
	})
	
	// marvin: query /api/img/get
	const {status, openAiUrl} = {status: "ready", openAiUrl: "https://oaidalleapiprodscus.blob.core.windows.net/private/org-QlV7bUj9CtoUf8UgTXPLL1JH/user-6prQk9LVzsOlvxHfrTfKpMQA/img-SbDNFMgGapPu3iBe80vRM3xj.png?st=2024-03-24T03%3A10%3A03Z&se=2024-03-24T05%3A10%3A03Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-03-23T21%3A32%3A19Z&ske=2024-03-24T21%3A32%3A19Z&sks=b&skv=2021-08-06&sig=62ZsP/z%2BcFBSP%2BvQ%2BQb6VhqMPoaI/ZgNvASfFIzavi0%3D"}

	if (status === "ready") {
		// get ipfs uri and gateway url
		const cid = imgToIPFS(openAiUrl, "pinataApiKey");
		const ipfsUri = `ipfs://${cid}`;
		const ipfsGatewayUrl = `https://amber-far-gazelle-427.mypinata.cloud/ipfs/${cid}`;

		// save ipfs uri and gateway url to state
		let state = await deriveState(async previousState => {
			previousState.ipfsUri = ipfsUri as State['ipfsUri']
		})
		state = await deriveState(async previousState => {
			previousState.ipfsGatewayUrl = ipfsGatewayUrl as State['ipfsGatewayUrl']
		})

		return c.res({
			action: "/mint-successful",
			image: (
				<div style={{ color: 'white', display: 'flex', fontSize: 60 }}>
				  <p>{ipfsUri}: Mint your {state.base} {state.pasta} with {state.topping1} and {state.topping2} pesto:
				  </p>
				  <p>Image: {ipfsGatewayUrl}</p>
				</div>
			  ),
			  intents: [<Button.Transaction target={`/mint/${cid}`}>Mint</Button.Transaction>],
		});
	} else {
		return c.res({
			action: "/refresh-img",
			image: (
				<div style={{ color: 'white', display: 'flex', fontSize: 60 }}>
				  <p>Check status for your {state.base} {state.pasta} with {state.topping1} and {state.topping2} pesto:
				  </p>
				</div>
			  ),
			  intents: [<Button value="refresh">Refresh</Button>],
		});
	}
})

app.frame("/mint-successful", (c) => {
	const { deriveState } = c
	const state = deriveState(previousState => {
	})

	return c.res({
		image: state.ipfsGatewayUrl || "default-image-url",
		imageAspectRatio: "1:1",
	});
});


app.transaction("/mint/:cid", (c) => {
	// Access the path parameter
	const cid = c.req.param('cid');
	const ipfsUri = `ipfs://${cid}`;
  
	// Call contract with IPFS URI as paramater
	return c.contract({
	  abi: pestoBowlAbi,
	  chainId: "eip155:84532", // base sepolia
	  functionName: "mint",
	  to: "0xCA43892A4a06E78b01C47ba84f07D6b97d96F938",  // our deployed contract address
	  args: [ipfsUri],
	});
  });
  
export const GET = handle(app);
export const POST = handle(app);
