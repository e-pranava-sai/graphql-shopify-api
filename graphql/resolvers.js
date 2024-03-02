function customReplacer(key, value) {
  console.log("value", value);
  if (typeof value === "number") {
    return value;
  }
  return value;
}

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
        "X-Shopify-Storefront-Access-Token":
          process.env.SHOPIFY_STORE_FRONT_ACCESS_TOKEN,
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
      const email = JSON.stringify(input.userEmail);
      const address1 = JSON.stringify(input.address.address1);
      const address2 = JSON.stringify(input.address.address2);
      const city = JSON.stringify(input.address.city);
      const province = JSON.stringify(input.address.province);
      const country = JSON.stringify(input.address.country);
      const zip = JSON.stringify(input.address.zip);

      let genLines = ``;
      input.lines.forEach((obj) => {
        genLines += `
          {
            quantity: ${obj.quantity}
            merchandiseId: "${obj.merchandiseId}"
          }
        `;
      });

      const query = `mutation create {
          cartCreate(
            input: {
              lines:[ ${genLines}]
              buyerIdentity: {
                email: ${email}
                deliveryAddressPreferences:{
                  deliveryAddress: {
                    address1: ${address1}
                    address2: ${address2}
                    city: ${city}
                    province: ${province}
                    country: ${country}
                    zip: ${zip}
                  },
                }
              }
              attributes: {
                key: "cart_attribute"
                value: "This is a cart attribute"
              }
            }
          ) {
            cart{
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
        }`;
      const res = await fetch(process.env.SHOPIFY_SHOP_URL, {
        async: true,
        crossDomain: true,
        method: "POST",
        headers: {
          "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN,
          "X-Shopify-Storefront-Access-Token":
            process.env.SHOPIFY_STORE_FRONT_ACCESS_TOKEN,
          "Content-Type": "application/graphql",
        },
        body: query,
      });
      const data = await res.json();
      const result = data.data.cartCreate.cart;
      return result;
    } catch (err) {
      console.log(err);
    }
  },
};
