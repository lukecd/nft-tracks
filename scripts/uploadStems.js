import Bundlr from "@bundlr-network/client";
import * as fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const privateKey = process.env.PRIVATE_KEY;
const currency = "matic"; // One of https://docs.bundlr.network/overview/supported-tokens

// Devnet (uploads are kept for 60 days)
const bundlr = new Bundlr("http://devnet.bundlr.network", currency, privateKey, {
	providerUrl: "https://rpc-mumbai.maticvigil.com", // MATIC Devnet, change if using a different currency
});

// Node 2 (uploads are permanent and immutable)
// const bundlr = new Bundlr("http://devnet.bundlr.network", currency, privateKey);

const filesToUpload = [
	"./stems/stem1.mp3",
	"./stems/stem2.mp3",
	"./stems/stem3.mp3",
	"./stems/stem4.mp3",
];
const tags = [{ name: "Content-Type", value: "audio/mpeg" }]; // Change the match the MIME-TYPE of your assets

for (let i = 0; i < filesToUpload.length; i++) {
	// Get size of file
	const { size } = await fs.promises.stat(filesToUpload[i]);
	// Get cost to upload "size" bytes
	const price = await bundlr.getPrice(size);
	console.log(
		`Uploading ${size} bytes costs ${bundlr.utils.fromAtomic(price)} ${currency}`,
	);
	// Fund the node
	await bundlr.fund(price);

	try {
		const response = await bundlr.uploadFile(filesToUpload[i], tags);
		console.log(`File uploaded ==> https://arweave.net/${response.id}`);
	} catch (e) {
		console.log("Error uploading file ", e);
	}
}
