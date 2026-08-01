import { useStoreActions, useStoreSnapshot } from "./store";

export function useAuth() {
  const actions = useStoreActions();
  const state = useStoreSnapshot((snapshot) => ({
    sessionInfo: snapshot,
    currentUser: snapshot.currentUser,
    isAuthenticated: snapshot.isAuthenticated,
    isAdmin: snapshot.isAdmin,
    profile: snapshot.profile,
    authPresets: snapshot.authPresets,
    stats: snapshot.stats,
    usersSummary: snapshot.usersSummary,
  }));

  return {
    ...state,
    login: actions.login,
    logout: actions.logout,
    register: actions.register,
    updateProfile: actions.updateProfile,
  };
}
