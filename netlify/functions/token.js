const { AccessToken, AgentDispatchClient } = require('livekit-server-sdk');
const { randomBytes } = require('crypto');

exports.handler = async () => {
  const roomName = `demo-${randomBytes(4).toString('hex')}`;

  const token = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    { identity: `user-${randomBytes(3).toString('hex')}`, name: 'Visiteur' }
  );
  token.addGrant({ roomJoin: true, room: roomName });

  const dispatch = new AgentDispatchClient(
    process.env.LIVEKIT_URL,
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET
  );
  await dispatch.createDispatch(roomName, 'immoops-ines');

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
