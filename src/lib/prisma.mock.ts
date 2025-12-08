// Mock Prisma client for build time
const mockPrisma: any = {
  notification: {
    findMany: async () => [],
  },
  bookmark: {
    findMany: async () => [],
  },
  post: {
    findMany: async () => [],
  },
  $transaction: async <T>(fn: (tx: typeof mockPrisma) => Promise<T>) => {
    if (typeof fn === 'function') {
      return fn(mockPrisma);
    }
    return [];
  },
  $queryRaw: async () => [],
  $executeRaw: async () => 0,
};

export default mockPrisma;