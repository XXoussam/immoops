const { AccessToken, RoomAgentDispatch, RoomConfiguration } = require('livekit-server-sdk');
const { randomBytes } = require('crypto');

exports.handler = async () => {
  const roomName = `demo-${randomBytes(4).toString('hex')}`;

  const token = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    { identity: `user-${randomBytes(3).toString('hex')}`, name: 'Visiteur' }
  );
  token.addGrant({ roomJoin: true, room: roomName });
  // Dispatch via the token, not AgentDispatchClient: the client SDK fetches tokens it
  // never uses (prepareConnection, end), which would otherwise spawn orphan agent jobs.
  token.roomConfig = new RoomConfiguration({
    agents: [new RoomAgentDispatch({ agentName: process.env.LIVEKIT_AGENT_NAME || 'immoops-ines' })],
  });

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      accessToken: await token.toJwt(),
      url: process.env.LIVEKIT_URL,
    }),
  };
};
