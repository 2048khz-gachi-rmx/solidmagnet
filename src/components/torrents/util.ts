export const normalizeTagInput = (value: string): string =>
  value
    .toLowerCase()
    .replaceAll(/[^a-z0-9-]/g, "-")
    .replace(/^-+/, "")
    .replaceAll(/-+/g, "-");

export const errorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

const fileTypeIcons: Record<string, string> = {
  archive: "folder_zip",
  audio: "music_note",
  data: "database",
  document: "description",
  image: "image",
  software: "desktop_windows",
  subtitles: "subtitles",
  video: "movie",
  unknown: "question_mark",
};

export const fileTypeIcon = (fileType?: string | null): string =>
  fileTypeIcons[fileType ?? "unknown"] ?? "question_mark";
