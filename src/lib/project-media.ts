import { Project } from "@/lib/constants";

export interface ProjectMedia {
  cover: string | undefined;
  gallery: string[];
  totalCount: number;
  hasScreenshots: boolean;
}

export function getProjectMedia(project: Project): ProjectMedia {
  const cover = project.image || undefined;
  const gallery = project.images || [];
  const totalCount = (cover ? 1 : 0) + gallery.length;
  const hasScreenshots = gallery.length > 0;

  return {
    cover,
    gallery,
    totalCount,
    hasScreenshots
  };
}
