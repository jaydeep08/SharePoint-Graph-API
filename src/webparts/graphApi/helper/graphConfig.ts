let siteId;
let graphClient;
let Context;

export const initGraph = (client, context) => {
  siteId = context.pageContext.site.id;
  Context = context;
  graphClient = client;
  console.log("++++++++++",graphClient)
}

export { siteId };
export { graphClient };
export { Context };