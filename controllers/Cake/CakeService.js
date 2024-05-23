const Cake = require("../../models/cake.js");
const fileService = require("../../fileService.js");

class CakeService {
  async create(cake, image) {
    const fileName = fileService.saveFile(image);
    return Cake.create({ ...cake, image: fileName });
  }

  async getAll() {
    return Cake.find();
  }

  async getOne(id) {
    if (!id) throw new Error("id is now provided");
    return Cake.findOne({ id });
  }

  async getByName(cakeName) {
    if (!cakeName) throw new Error("Name is not provided");

    try {
      const cakes = await Cake.find({
        name: { $regex: new RegExp(cakeName, "i") },
      });
      return cakes;
    } catch (error) {
      throw new Error("Error retrieving cakes by name: " + error.message);
    }
  }

  async update(cake) {
    if (!cake._id) throw new Error("id is now provided");
    return Cake.findByIdAndUpdate(cake._id, cake, {
      new: true,
    });
  }

  async delete(id) {
    if (!id) throw new Error("id is now provided");
    return Cake.findByIdAndDelete(id);
  }
}

module.exports = new CakeService();
