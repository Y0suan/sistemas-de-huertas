import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "./auth/[...nextauth]";
import { Huerta } from "@/models/Huerta";

export default async function handle(req, res) {
  try {
    await mongooseConnect();
    await isAdminRequest(req, res);

    const { method } = req;

    if (method === "GET") {
      if (req.query?.id) {
        const huerta = await Huerta.findOne({ _id: req.query.id });
        res.json(huerta);
      } else {
        const huertas = await Huerta.find();
        res.json(huertas);
      }
    }

    if (method === "POST") {
      const {
        referente,
        dni,
        calle,
        km,
        barrio,
        fecha,
        superficie,
        entregado,
        images,
        properties,
      } = req.body;
      const huerta = await Huerta.create({
        referente,
        dni,
        calle,
        km,
        barrio,
        fecha,
        superficie,
        entregado,
        images,
        properties,
      });
      res.json(huerta);
    }

    if (method === "PUT") {
      const {
        referente,
        dni,
        calle,
        km,
        barrio,
        fecha,
        superficie,
        entregado,
        images,
        properties,
        _id,
      } = req.body;

      const updatedHuerta = await Huerta.findOneAndUpdate(
        { _id },
        {
          $set: {
            referente,
            dni,
            calle,
            km,
            barrio,
            fecha,
            superficie,
            entregado,
            images,
            properties,
          },
        },
        { new: true } // Return the updated document
      );

      res.json(updatedHuerta);
    }

    if (method === "DELETE") {
      if (req.query?.id) {
        await Huerta.deleteOne({ _id: req.query.id });
        res.json({ success: true });
      } else {
        res.status(400).json({ error: "Missing id parameter in the request" });
      }
    }
  } catch (error) {
    console.error("Error handling request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
