import Fastify from "fastify";
import { languages } from "./languages.js";
import { translator } from "./translator.js";

const fastify = Fastify({
	logger: true,
});

fastify.get("/available-languages", (_, reply) => {
	reply.send(languages);
});

fastify.get("/translate", async (request, reply) => {
	const { srcLang, tgtLang, text } = request.query;
	const translation = await translator.translate(srcLang, tgtLang, text);
	reply.send({ translation });
});

fastify.listen({ port: 3000 }, (err, address) => {
	if (err) {
		fastify.log.error(err);
		process.exit(1);
	}
	console.log(`Server is now listening on ${address}`);
});
