const start = async () => {
  const app = await buildApp({
    logger: {
      transport: {
        target: 'pino-pretty'
      }
    }
  });
  
  try{
    await app.listen({ port: 3000, host: '0.0.0.0' });
    app.log.info(`Server is running on ${app.server.address().port}`);
    
  }catch(err)
  {
    app.log.info("server startup / run failed " , err)
    process.exit(1);
  }
}