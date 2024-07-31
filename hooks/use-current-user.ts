import { useOxySession } from "@oxyhq/services";

export const useCurrentUser = () => {
  const { session } = useOxySession();

  return session?.user;
};
