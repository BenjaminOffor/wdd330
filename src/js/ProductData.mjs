async function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export default class ProductData {
  constructor(category) {
    this.category = category;
    this.path = `../json/${this.category}.json`;
  }

  async getData() {
    try {
      const res = await fetch(this.path);
      return await convertToJson(res);
    } catch (error) {
      console.error("Failed to fetch or parse JSON:", error);
      throw error; // rethrow so callers can handle it
    }
  }

  async findProductById(id) {
    const products = await this.getData();
    return products.find((item) => item.Id === id); // or item.id if your JSON uses lowercase
  }
}
