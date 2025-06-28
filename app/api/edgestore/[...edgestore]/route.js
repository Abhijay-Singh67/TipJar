const { initEdgeStore } = require("@edgestore/server");
const {createEdgeStoreNextHandler} = require("@edgestore/server/adapters/next/app");

const es = initEdgeStore.create();
const edgeStoreRouter = es.router({
    tipjarImages: es.imageBucket(),
})

const handler = createEdgeStoreNextHandler({
    router: edgeStoreRouter,
})

export { handler as GET, handler as POST};