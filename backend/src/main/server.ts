import { createApp } from './app';

const PORT = process.env.PORT ?? 3001;

const app = createApp();

app.listen(PORT, () => {
  console.log(`\n🚀  Task Management API`);
  console.log(`   Running on  → http://localhost:${PORT}`);
  console.log(`\n📋  Endpoints:`);
  console.log(`   GET    /tasks         List all tasks (?status= filter supported)`);
  console.log(`   POST   /tasks         Create a task`);
  console.log(`   PUT    /tasks/:id     Update a task`);
  console.log(`   DELETE /tasks/:id     Soft-delete a task`);
  console.log(`   GET    /health        Health check\n`);
});
