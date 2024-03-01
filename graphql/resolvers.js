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

  createCart: async function ({ input }, req) {
    try {
      const query = `
    mutation {
      cartCreate(
        input: {
          lines: [],
          buyerIdentity: {
            email: ${input.userEmail},
            countryCode: ${input.userCountryCode},
            deliveryAddressPreferences:{
              deliveryAddress: {
                address1: ${input.address.address1},
                address2: ${input.address.address2},
                city: ${input.address.city},
                province: ${input.address.province},
                country: ${input.address.country},
                zip: ${input.address.zip}
              },
            }
          }
          attributes: {
            key: "cart_attribute",
            value: "This is a cart attribute"
          }
        }
      ) {
        id
        createdAt
        updatedAt
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
      }
    }
    `;
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
      console.log(data);
      return data.data.cartCreate.cart;
    } catch (err) {
      console.log(err);
    }
  },
};
