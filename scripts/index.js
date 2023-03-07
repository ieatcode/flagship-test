const Shopify = require("shopify-api-node");

const shopify = new Shopify({
  shopName: process.env.SHOPNAME,
  apiKey: process.env.APIKEY,
  password: process.env.APIPASSWORD,
});

const argument = process.argv.slice(2);
const idFlagIndex = argument.includes("--id") && argument.indexOf("--id");
const productId = idFlagIndex ? argument[idFlagIndex + 1] : 8147115442454;
const valueIncrement = 1;
const defaultMetaField = {
  namespace: "global",
  key: "test",
  type: "integer",
  owner_resource: "product",
  value: 0,
  owner_id: productId,
};

const deleteMetaField = async (id) => {
  if (!id) return;

  console.log("[reset]");
  shopify.metafield.delete(id);
};

const updateMetaField = async (metafield, newValue) => {
  if (!metafield) throw new Error("metafield not found");
  console.log("[update]");
  return await shopify.metafield
    .update(metafield.id, { ...metafield, value: newValue })
    .then((result) => result)
    .catch((error) => error);
};

const createMetaField = async (newMetafield) => {
  if (!newMetafield) throw new Error("newMetafield not found");
  console.log("[insert]");
  return shopify.metafield
    .create(newMetafield)
    .then((result) => result)
    .catch((error) => ({ error }));
};

const getMetafields = async (metafield) => {
  if (!metafield) return;
  return shopify.metafield
    .list({ metafield })
    .then((metafields) => metafields)
    .catch((error) => {
      console.log({ error: error.message });
    });
};

const renderValue = async (metafieldFound) =>
  metafieldFound && Object.keys(metafieldFound).length
    ? parseInt(metafieldFound.value, 10) + valueIncrement
    : defaultMetaField.value;

const saveMetaField = async (metafieldFound, newValue) =>
  metafieldFound && Object.keys(metafieldFound).length
    ? await updateMetaField(metafieldFound, newValue)
    : await createMetaField(defaultMetaField);

const findMetaField = (metafields) =>
  metafields.find((item) => item.key === defaultMetaField.key);

const flagshipShopify = async () => {
  console.log(`Processing ID: ${productId}`);
  const metafields = await getMetafields(defaultMetaField);
  if (!metafields) return;
  const metafieldFound = await findMetaField(metafields);
  const newValue = await renderValue(metafieldFound);
  const { id, value } = await saveMetaField(metafieldFound, newValue);
  console.log("result: ", { value });

  const deleteFlagIndex = argument.includes("--delete");
  if (deleteFlagIndex) {
    deleteMetaField(id);
  }
};

if (argument.includes("--start")) {
  flagshipShopify();
}

module.exports = {
  renderValue
};
