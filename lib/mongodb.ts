import { MongoClient, Db } from 'mongodb'

interface MongoClientPromise {
  db: (name?: string) => Db
}

function createMockClientPromise(): Promise<MongoClientPromise> {
  return Promise.resolve({
    db: () => ({
      collection: () => ({
        updateOne: async () => ({ acknowledged: true, upsertedCount: 0 }),
      }),
    }),
  } as unknown as MongoClientPromise)
}

let clientPromise: Promise<MongoClientPromise>

if (process.env.MONGODB_URI) {
  const uri = process.env.MONGODB_URI
  const options = {}

  let client: MongoClient
  if (process.env.NODE_ENV === 'development') {
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClientPromise>
    }

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options)
      globalWithMongo._mongoClientPromise = client.connect()
    }
    clientPromise = globalWithMongo._mongoClientPromise
  } else {
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
  }
} else {
  clientPromise = createMockClientPromise()
}

export default clientPromise