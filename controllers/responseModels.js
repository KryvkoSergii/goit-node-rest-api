export const errorBody = (msg) => ({ message: msg });
export const userObject = (email, subscription, avatarURL) => ({
  email: email,
  subscription: subscription,
  avatarURL: avatarURL,
});

