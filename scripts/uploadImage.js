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

const fileToUpload = "./images/gol-thumbnail.png";
const tags = [{ name: "Content-Type", value: "image/png" }]; // or image/jpeg

// Get size of file
const { size } = await fs.promises.stat(fileToUpload);
// Get cost to upload "size" bytes
const price = await bundlr.getPrice(size);
console.log(
	`Uploading ${size} bytes costs ${bundlr.utils.fromAtomic(price)} ${currency}`,
);
// Fund the node
await bundlr.fund(price);

// Upload image
try {
	const response = await bundlr.uploadFile(fileToUpload, tags);
	console.log(`File uploaded ==> https://arweave.net/${response.id}`);
} catch (e) {
	console.log("Error uploading file ", e);
}
