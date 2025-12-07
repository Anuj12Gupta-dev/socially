// Mock Prisma client for build time
const mockPrisma = {
  notification: {
    findMany: async () => [],
  },
  bookmark: {
    findMany: async () => [],
  },
  post: {
    findMany: async () => [],
  },
  $transaction: async (fn: any) => {
    if (typeof fn === 'function') {
      return fn(mockPrisma);
    }
    return [];
  },
  $queryRaw: async () => [],
  $executeRaw: async () => 0,
};

export default mockPrisma;