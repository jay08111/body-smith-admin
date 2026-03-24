import { useLocation } from "@tanstack/react-router";
import { useMemo } from "react";
import useProjectQuery from "@/hooks/cache/use-project-query";

const findMenuItemByUrl = (items: any[], url: string): any => {
  for (const item of items) {
    if (item.url === url) {
      return item;
    }

    if (item.items && item.items.length > 0) {
      const found = findMenuItemByUrl(item.items, url);
      if (found) {
        return found;
      }
    }
  }
  return null;
};

const createUrlToMenuItemMap = (items: any[]): Map<string, any> => {
  const map = new Map<string, any>();

  const traverse = (menuItems: any[]) => {
    for (const item of menuItems) {
      if (item.url) {
        map.set(item.url, item);
      }

      if (item.items && item.items.length > 0) {
        traverse(item.items);
      }
    }
  };

  traverse(items);
  return map;
};

export function useLocationHook() {
  const { projectInfo } = useProjectQuery();
  const location = useLocation();
  const basePath = location.pathname.split("/").slice(0, -1).join("/");

  const urlToMenuItemMap = useMemo(() => {
    if (!projectInfo?.attribute) {
      return new Map();
    }
    return createUrlToMenuItemMap(projectInfo.attribute);
  }, [projectInfo?.attribute]);

  const _listCurr = useMemo(() => {
    return urlToMenuItemMap.get(location.pathname) || null;
  }, [urlToMenuItemMap, location.pathname]);

  const _createCurr = useMemo(() => {
    return urlToMenuItemMap.get(basePath) || null;
  }, [urlToMenuItemMap, basePath]);

  const _detailCurr = useMemo(() => {
    return urlToMenuItemMap.get(basePath) || null;
  }, [urlToMenuItemMap, basePath]);

  return { location, _listCurr, _createCurr, _detailCurr };
}
