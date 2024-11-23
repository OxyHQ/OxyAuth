import { prisma } from '@/lib/db';

export const getAccessToken = async (accessToken) => {
  try {
    const token = await prisma.accessToken.findUnique({
      where: {
        accessToken: accessToken,
      },
      include: {
        client: true,
        user: true,
      },
    });

    if (!token) {
      return null;
    }

    return {
      accessToken: token.accessToken,
      accessTokenExpiresAt: token.accessTokenExpiresAt,
      client: token.client,
      user: token.user,
      scope: token.scope,
    };
  } catch (error) {
    console.error('Error retrieving access token:', error);
    return null;
  }
};

export const getClient = async (clientId, clientSecret) => {
  try {
    const client = await prisma.client.findUnique({
      where: {
        clientId: clientId,
        clientSecret: clientSecret,
      },
    });

    if (!client) {
      return null;
    }

    return {
      id: client.id,
      redirectUris: client.redirectUris,
      grants: client.grants,
      accessTokenLifetime: client.accessTokenLifetime,
      refreshTokenLifetime: client.refreshTokenLifetime,
    };
  } catch (error) {
    console.error('Error retrieving client:', error);
    return null;
  }
};

export const saveToken = async (token, client, user) => {
  try {
    const savedToken = await prisma.accessToken.create({
      data: {
        accessToken: token.accessToken,
        accessTokenExpiresAt: token.accessTokenExpiresAt,
        client: {
          connect: {
            id: client.id,
          },
        },
        user: {
          connect: {
            id: user.id,
          },
        },
        scope: token.scope,
      },
    });

    return {
      accessToken: savedToken.accessToken,
      accessTokenExpiresAt: savedToken.accessTokenExpiresAt,
      client: savedToken.client,
      user: savedToken.user,
      scope: savedToken.scope,
    };
  } catch (error) {
    console.error('Error saving token:', error);
    return null;
  }
};

export const getUser = async (username, password) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
        password: password,
      },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      username: user.username,
      password: user.password,
    };
  } catch (error) {
    console.error('Error retrieving user:', error);
    return null;
  }
};

export const verifyScope = (token, scope) => {
  if (!token.scope) {
    return false;
  }

  const requestedScopes = scope.split(' ');
  const authorizedScopes = token.scope.split(' ');

  return requestedScopes.every((requestedScope) =>
    authorizedScopes.includes(requestedScope)
  );
};
