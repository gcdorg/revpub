export const getCurrentUserAvatarUrl = (): string => {
  const userAvatarUrl = localStorage.getItem("user-avatar-url");
  if (userAvatarUrl === null) {
    return "";
  }
  return userAvatarUrl;
}