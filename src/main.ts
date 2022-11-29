import Fastify from "fastify";
import { z, ZodError } from "zod";
import { ImageResizer } from "./core/Image";

const fastify = Fastify({});

const resizer = new ImageResizer();

interface ResizeBody {
  imgData?: string;
}

fastify.get("/", function (_request, reply) {
  reply.send({ status: "running" });
});

fastify.post<{ Body: ResizeBody }>("/resize", {}, async (request, reply) => {
  try {
    const resizeSchema = z.string().min(1, { message: "Body must be at least one character" });

    const result = resizeSchema.parse(request.body?.imgData);
    const resizedImage = await resizer.resize(
      {
        base64ImageData: result,
        timestamp: new Date().getTime(),
      },
      300,
      300
    );

    reply.send({ data: resizedImage });
  } catch (error) {
    if (error instanceof ZodError) {
      console.log(error);
      return reply.status(500).send({ error: error.errors[0]?.message });
    }
    reply.status(500).send({ error: "Could not process request" });
  }
});

const PORT = parseInt(process.env.PORT || "3000") || 3000;

fastify.listen(
  { port: PORT, host: "0.0.0.0" },
  async (err, address) => {
    console.log(address);
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  }
);
