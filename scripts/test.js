const expect = require("expect.js");
const {
  renderValue
} = require("./");

describe("when metafield does NOT exists", async function () {
  it("should return 0", async function () {
    await renderValue(null).then((metafields) => {
      expect(metafields).to.equal(0);
    });
  });
});

describe("when metafield exists", async function () {
  it("should return 1", async function () {
    const defaultMetaField = {
      namespace: "global",
      key: "test",
      value_type: "integer",
      owner_resource: "product",
      value: 0
    };

    await renderValue(defaultMetaField).then((metafields) => {
      expect(metafields).to.equal(1);
    });
  });

  it("should return 11", async function () {
    const defaultMetaField = {
      namespace: "global",
      key: "test",
      value_type: "integer",
      owner_resource: "product",
      value: 10
    };

    await renderValue(defaultMetaField).then((metafields) => {
      expect(metafields).to.equal(11);
    });
  });
});
