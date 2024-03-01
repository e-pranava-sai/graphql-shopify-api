module.exports = {
  fetchProducts: async function ({ page }, req) {
    const query = `{
        products(first: ${page}) {
            edges {
                node {
                    id
                    title
                }
            }
        }
    }`;
    const res = await fetch(process.env.SHOPIFY_SHOP_URL, {
      async: true,
      crossDomain: true,
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN,
        "Content-Type": "application/graphql",
      },
      body: query,
    });
    const data = await res.json();
    const products = data.data.products.edges.map(({ node }) => ({
      id: node.id,
      title: node.title,
    }));
    return products;
  },
};
