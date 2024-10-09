declare module '@nest-lab/fastify-multer' {
  interface FastifyMulterFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
  }
}
