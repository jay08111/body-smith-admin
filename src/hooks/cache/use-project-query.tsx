import { useQuery } from "@tanstack/react-query";
import { getProjectInfo, getProjectPermission } from "@/lib/api/project";
import { PROJECT_KEYS, STALE_TIME } from "@/hooks/cache/query-keys";
import { TOKEN_STRING } from "@/config/vars";

interface UseProjectQueryOptions {
  enabled?: boolean;
}

const useProjectQuery = ({ enabled = true }: UseProjectQueryOptions = {}) => {
  const { data: projectInfo, isLoading: isProjectInfoLoading } = useQuery({
    queryKey: [PROJECT_KEYS.PROJECT_INFO],
    queryFn: () => {
      const token = localStorage.getItem(TOKEN_STRING);
      return getProjectInfo(token ?? "");
    },
    staleTime: STALE_TIME.FIVE_HOURS,
    enabled,
  });

  const { data: projectPm, isLoading: isProjectPmLoading } = useQuery({
    queryKey: [PROJECT_KEYS.PROJECT_PERMISSION],
    queryFn: () => {
      const token = localStorage.getItem(TOKEN_STRING);
      return getProjectPermission(token ?? "");
    },
    staleTime: STALE_TIME.FIVE_HOURS,
    enabled,
  });

  return {
    projectInfo,
    projectPm,
    isProjectInfoLoading,
    isProjectPmLoading,
  };
};

export default useProjectQuery;
