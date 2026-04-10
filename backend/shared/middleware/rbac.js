// Using native Node 18+ fetch

let redisClient = null;
export function setRedisClient(client) {
  redisClient = client;
}

// Fetch membership for this org from user-auth-service (cached in Redis 60s)
async function getMembership(userId, orgId) {
  if (!userId || !orgId) return null;

  const cacheKey = `membership:${userId}:${orgId}`;
  
  if (redisClient) {
    const cached = await redisClient.get(cacheKey);
    if (cached) return JSON.parse(cached);
  }

  try {
    // In production, AUTH_SERVICE_URL would resolve to the internal docker network URL
    const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
    const response = await fetch(`${authServiceUrl}/internal/membership/${userId}/${orgId}`);
    if (!response.ok) return null;
    
    const membership = await response.json();
    
    if (redisClient && membership) {
       await redisClient.setEx(cacheKey, 60, JSON.stringify(membership));
    }
    
    return membership;
  } catch (error) {
    console.error('Failed to fetch membership:', error.message);
    return null;
  }
}

export function requireOrgRole(...allowedRoles) {
  return async (req, res, next) => {
    if (!req.jwt) {
       return res.status(401).json({ error: 'Unauthorized: No JWT payload found' });
    }
    
    const { sub: userId, role } = req.jwt;

    // Fast path: admin in JWT -> always allowed
    if (role === 'admin') return next();

    const orgIdParam = req.params.orgId || req.body.orgId;
    if (!orgIdParam) {
       return res.status(400).json({ error: 'Bad Request: orgId must be provided for RBAC check' });
    }

    const membership = await getMembership(userId, orgIdParam);

    if (!membership || !allowedRoles.includes(membership.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    req.membership = membership;
    next();
  };
}
