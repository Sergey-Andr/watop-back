const CakeService = require("./CakeService.js");

class CakeController {
  async create(req, res) {
    try {
      const post = await CakeService.create(req.body, req.files.image);
      res.send(post);
    } catch (e) {
      res.status(400).json(e.message);
    }
  }

  async getAll(req, res) {
    try {
      const cakes = await CakeService.getAll();
      return res.send(cakes);
    } catch (e) {
      res.status(400).json(e.message);
    }
  }

  async getOne(req, res) {
    try {
      const cake = await CakeService.getOne(req.params.id);
      return res.send(cake);
    } catch (e) {
      res.status(400).json(e.message);
    }
  }

  async getByName(req, res) {
    try {
      const cake = await CakeService.getByName(req.params.name);

      return res.send(cake);
    } catch (e) {
      res.status(400).json(e.message);
    }
  }

  async update(req, res) {
    try {
      const updatedCake = await CakeService.update(req.body);
      return res.send(updatedCake);
    } catch (e) {
      res.status(400).json(e.message);
    }
  }

  async delete(req, res) {
    try {
      const cake = await CakeService.delete(req.params.id);
      return res.send(cake);
    } catch (e) {
      res.status(400).json(e.message);
    }
  }
}

module.exports = new CakeController();
