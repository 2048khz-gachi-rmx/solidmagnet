/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
import type * as Types from "./schema-types";

import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
export type ContentFragment = {
  type: Types.ContentType;
  source: string;
  id: string;
  title: string;
  releaseDate: string | null;
  releaseYear: number | null;
  overview: string | null;
  runtime: number | null;
  voteAverage: number | null;
  voteCount: number | null;
  createdAt: string;
  updatedAt: string;
  metadataSource: { key: string; name: string };
  originalLanguage: { id: string; name: string } | null;
  attributes: Array<{
    source: string;
    key: string;
    value: string;
    createdAt: string;
    updatedAt: string;
    metadataSource: { key: string; name: string };
  }>;
  collections: Array<{
    type: string;
    source: string;
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    metadataSource: { key: string; name: string };
  }>;
  externalLinks: Array<{
    url: string;
    metadataSource: { key: string; name: string };
  }>;
};

export type QueueJobFragment = {
  id: string;
  queue: string;
  status: Types.QueueJobStatus;
  payload: string;
  priority: number;
  retries: number;
  maxRetries: number;
  runAfter: string;
  ranAt: string | null;
  error: string | null;
  createdAt: string;
};

export type QueueJobsQueryResultFragment = {
  totalCount: number;
  hasNextPage: boolean | null;
  items: Array<{
    id: string;
    queue: string;
    status: Types.QueueJobStatus;
    payload: string;
    priority: number;
    retries: number;
    maxRetries: number;
    runAfter: string;
    ranAt: string | null;
    error: string | null;
    createdAt: string;
  }>;
  aggregations: {
    queue: Array<{ value: string; label: string; count: number }> | null;
    status: Array<{
      value: Types.QueueJobStatus;
      label: string;
      count: number;
    }> | null;
  };
};

export type TorrentFragment = {
  infoHash: string;
  name: string;
  size: number;
  filesStatus: Types.FilesStatus;
  filesCount: number | null;
  hasFilesInfo: boolean;
  singleFile: boolean | null;
  fileType: Types.FileType | null;
  seeders: number | null;
  leechers: number | null;
  tagNames: Array<string>;
  magnetUri: string;
  createdAt: string;
  updatedAt: string;
  sources: Array<{ key: string; name: string }>;
};

export type TorrentContentFragment = {
  id: string;
  infoHash: string;
  contentType: Types.ContentType | null;
  title: string;
  video3d: Types.Video3D | null;
  videoCodec: Types.VideoCodec | null;
  videoModifier: Types.VideoModifier | null;
  videoResolution: Types.VideoResolution | null;
  videoSource: Types.VideoSource | null;
  seeders: number | null;
  leechers: number | null;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  torrent: {
    infoHash: string;
    name: string;
    size: number;
    filesStatus: Types.FilesStatus;
    filesCount: number | null;
    hasFilesInfo: boolean;
    singleFile: boolean | null;
    fileType: Types.FileType | null;
    seeders: number | null;
    leechers: number | null;
    tagNames: Array<string>;
    magnetUri: string;
    createdAt: string;
    updatedAt: string;
    sources: Array<{ key: string; name: string }>;
  };
  content: {
    type: Types.ContentType;
    source: string;
    id: string;
    title: string;
    releaseDate: string | null;
    releaseYear: number | null;
    overview: string | null;
    runtime: number | null;
    voteAverage: number | null;
    voteCount: number | null;
    createdAt: string;
    updatedAt: string;
    metadataSource: { key: string; name: string };
    originalLanguage: { id: string; name: string } | null;
    attributes: Array<{
      source: string;
      key: string;
      value: string;
      createdAt: string;
      updatedAt: string;
      metadataSource: { key: string; name: string };
    }>;
    collections: Array<{
      type: string;
      source: string;
      id: string;
      name: string;
      createdAt: string;
      updatedAt: string;
      metadataSource: { key: string; name: string };
    }>;
    externalLinks: Array<{
      url: string;
      metadataSource: { key: string; name: string };
    }>;
  } | null;
  languages: Array<{ id: string; name: string }> | null;
  episodes: {
    label: string;
    seasons: Array<{ season: number; episodes: Array<number> | null }>;
  } | null;
};

export type TorrentContentSearchResultFragment = {
  totalCount: number;
  totalCountIsEstimate: boolean;
  hasNextPage: boolean | null;
  items: Array<{
    id: string;
    infoHash: string;
    contentType: Types.ContentType | null;
    title: string;
    video3d: Types.Video3D | null;
    videoCodec: Types.VideoCodec | null;
    videoModifier: Types.VideoModifier | null;
    videoResolution: Types.VideoResolution | null;
    videoSource: Types.VideoSource | null;
    seeders: number | null;
    leechers: number | null;
    publishedAt: string;
    createdAt: string;
    updatedAt: string;
    torrent: {
      infoHash: string;
      name: string;
      size: number;
      filesStatus: Types.FilesStatus;
      filesCount: number | null;
      hasFilesInfo: boolean;
      singleFile: boolean | null;
      fileType: Types.FileType | null;
      seeders: number | null;
      leechers: number | null;
      tagNames: Array<string>;
      magnetUri: string;
      createdAt: string;
      updatedAt: string;
      sources: Array<{ key: string; name: string }>;
    };
    content: {
      type: Types.ContentType;
      source: string;
      id: string;
      title: string;
      releaseDate: string | null;
      releaseYear: number | null;
      overview: string | null;
      runtime: number | null;
      voteAverage: number | null;
      voteCount: number | null;
      createdAt: string;
      updatedAt: string;
      metadataSource: { key: string; name: string };
      originalLanguage: { id: string; name: string } | null;
      attributes: Array<{
        source: string;
        key: string;
        value: string;
        createdAt: string;
        updatedAt: string;
        metadataSource: { key: string; name: string };
      }>;
      collections: Array<{
        type: string;
        source: string;
        id: string;
        name: string;
        createdAt: string;
        updatedAt: string;
        metadataSource: { key: string; name: string };
      }>;
      externalLinks: Array<{
        url: string;
        metadataSource: { key: string; name: string };
      }>;
    } | null;
    languages: Array<{ id: string; name: string }> | null;
    episodes: {
      label: string;
      seasons: Array<{ season: number; episodes: Array<number> | null }>;
    } | null;
  }>;
  aggregations: {
    contentType: Array<{
      value: Types.ContentType | null;
      label: string;
      count: number;
      isEstimate: boolean;
    }> | null;
    torrentSource: Array<{
      value: string;
      label: string;
      count: number;
      isEstimate: boolean;
    }> | null;
    torrentTag: Array<{
      value: string;
      label: string;
      count: number;
      isEstimate: boolean;
    }> | null;
    torrentFileType: Array<{
      value: Types.FileType;
      label: string;
      count: number;
      isEstimate: boolean;
    }> | null;
    language: Array<{
      value: Types.Language;
      label: string;
      count: number;
      isEstimate: boolean;
    }> | null;
    genre: Array<{
      value: string;
      label: string;
      count: number;
      isEstimate: boolean;
    }> | null;
    releaseYear: Array<{
      value: number | null;
      label: string;
      count: number;
      isEstimate: boolean;
    }> | null;
    videoResolution: Array<{
      value: Types.VideoResolution | null;
      label: string;
      count: number;
      isEstimate: boolean;
    }> | null;
    videoSource: Array<{
      value: Types.VideoSource | null;
      label: string;
      count: number;
      isEstimate: boolean;
    }> | null;
  };
};

export type TorrentFileFragment = {
  infoHash: string;
  index: number;
  path: string;
  size: number;
  fileType: Types.FileType | null;
  createdAt: string;
  updatedAt: string;
};

export type TorrentFilesQueryResultFragment = {
  totalCount: number;
  hasNextPage: boolean | null;
  items: Array<{
    infoHash: string;
    index: number;
    path: string;
    size: number;
    fileType: Types.FileType | null;
    createdAt: string;
    updatedAt: string;
  }>;
};

export type QueueEnqueueReprocessTorrentsBatchMutationVariables = Exact<{
  input: Types.QueueEnqueueReprocessTorrentsBatchInput;
}>;

export type QueueEnqueueReprocessTorrentsBatchMutation = {
  queue: { enqueueReprocessTorrentsBatch: void | null };
};

export type QueuePurgeJobsMutationVariables = Exact<{
  input: Types.QueuePurgeJobsInput;
}>;

export type QueuePurgeJobsMutation = { queue: { purgeJobs: void | null } };

export type TorrentDeleteMutationVariables = Exact<{
  infoHashes: Array<string> | string;
}>;

export type TorrentDeleteMutation = { torrent: { delete: void | null } };

export type TorrentDeleteTagsMutationVariables = Exact<{
  infoHashes?: Array<string> | string | null | undefined;
  tagNames?: Array<string> | string | null | undefined;
}>;

export type TorrentDeleteTagsMutation = {
  torrent: { deleteTags: void | null };
};

export type TorrentPutTagsMutationVariables = Exact<{
  infoHashes: Array<string> | string;
  tagNames: Array<string> | string;
}>;

export type TorrentPutTagsMutation = { torrent: { putTags: void | null } };

export type TorrentReprocessMutationVariables = Exact<{
  input: Types.TorrentReprocessInput;
}>;

export type TorrentReprocessMutation = { torrent: { reprocess: void | null } };

export type TorrentSetTagsMutationVariables = Exact<{
  infoHashes: Array<string> | string;
  tagNames: Array<string> | string;
}>;

export type TorrentSetTagsMutation = { torrent: { setTags: void | null } };

export type HealthCheckQueryVariables = Exact<{ [key: string]: never }>;

export type HealthCheckQuery = {
  health: {
    status: Types.HealthStatus;
    checks: Array<{
      key: string;
      status: Types.HealthStatus;
      timestamp: string;
      error: string | null;
    }>;
  };
  workers: { listAll: { workers: Array<{ key: string; started: boolean }> } };
};

export type QueueJobsQueryVariables = Exact<{
  input: Types.QueueJobsQueryInput;
}>;

export type QueueJobsQuery = {
  queue: {
    jobs: {
      totalCount: number;
      hasNextPage: boolean | null;
      items: Array<{
        id: string;
        queue: string;
        status: Types.QueueJobStatus;
        payload: string;
        priority: number;
        retries: number;
        maxRetries: number;
        runAfter: string;
        ranAt: string | null;
        error: string | null;
        createdAt: string;
      }>;
      aggregations: {
        queue: Array<{ value: string; label: string; count: number }> | null;
        status: Array<{
          value: Types.QueueJobStatus;
          label: string;
          count: number;
        }> | null;
      };
    };
  };
};

export type QueueMetricsQueryVariables = Exact<{
  input: Types.QueueMetricsQueryInput;
}>;

export type QueueMetricsQuery = {
  queue: {
    metrics: {
      buckets: Array<{
        queue: string;
        status: Types.QueueJobStatus;
        createdAtBucket: string;
        ranAtBucket: string | null;
        count: number;
        latency: string | null;
      }>;
    };
  };
};

export type TorrentContentSearchQueryVariables = Exact<{
  input: Types.TorrentContentSearchQueryInput;
}>;

export type TorrentContentSearchQuery = {
  torrentContent: {
    search: {
      totalCount: number;
      totalCountIsEstimate: boolean;
      hasNextPage: boolean | null;
      items: Array<{
        id: string;
        infoHash: string;
        contentType: Types.ContentType | null;
        title: string;
        video3d: Types.Video3D | null;
        videoCodec: Types.VideoCodec | null;
        videoModifier: Types.VideoModifier | null;
        videoResolution: Types.VideoResolution | null;
        videoSource: Types.VideoSource | null;
        seeders: number | null;
        leechers: number | null;
        publishedAt: string;
        createdAt: string;
        updatedAt: string;
        torrent: {
          infoHash: string;
          name: string;
          size: number;
          filesStatus: Types.FilesStatus;
          filesCount: number | null;
          hasFilesInfo: boolean;
          singleFile: boolean | null;
          fileType: Types.FileType | null;
          seeders: number | null;
          leechers: number | null;
          tagNames: Array<string>;
          magnetUri: string;
          createdAt: string;
          updatedAt: string;
          sources: Array<{ key: string; name: string }>;
        };
        content: {
          type: Types.ContentType;
          source: string;
          id: string;
          title: string;
          releaseDate: string | null;
          releaseYear: number | null;
          overview: string | null;
          runtime: number | null;
          voteAverage: number | null;
          voteCount: number | null;
          createdAt: string;
          updatedAt: string;
          metadataSource: { key: string; name: string };
          originalLanguage: { id: string; name: string } | null;
          attributes: Array<{
            source: string;
            key: string;
            value: string;
            createdAt: string;
            updatedAt: string;
            metadataSource: { key: string; name: string };
          }>;
          collections: Array<{
            type: string;
            source: string;
            id: string;
            name: string;
            createdAt: string;
            updatedAt: string;
            metadataSource: { key: string; name: string };
          }>;
          externalLinks: Array<{
            url: string;
            metadataSource: { key: string; name: string };
          }>;
        } | null;
        languages: Array<{ id: string; name: string }> | null;
        episodes: {
          label: string;
          seasons: Array<{ season: number; episodes: Array<number> | null }>;
        } | null;
      }>;
      aggregations: {
        contentType: Array<{
          value: Types.ContentType | null;
          label: string;
          count: number;
          isEstimate: boolean;
        }> | null;
        torrentSource: Array<{
          value: string;
          label: string;
          count: number;
          isEstimate: boolean;
        }> | null;
        torrentTag: Array<{
          value: string;
          label: string;
          count: number;
          isEstimate: boolean;
        }> | null;
        torrentFileType: Array<{
          value: Types.FileType;
          label: string;
          count: number;
          isEstimate: boolean;
        }> | null;
        language: Array<{
          value: Types.Language;
          label: string;
          count: number;
          isEstimate: boolean;
        }> | null;
        genre: Array<{
          value: string;
          label: string;
          count: number;
          isEstimate: boolean;
        }> | null;
        releaseYear: Array<{
          value: number | null;
          label: string;
          count: number;
          isEstimate: boolean;
        }> | null;
        videoResolution: Array<{
          value: Types.VideoResolution | null;
          label: string;
          count: number;
          isEstimate: boolean;
        }> | null;
        videoSource: Array<{
          value: Types.VideoSource | null;
          label: string;
          count: number;
          isEstimate: boolean;
        }> | null;
      };
    };
  };
};

export type TorrentFilesQueryVariables = Exact<{
  input: Types.TorrentFilesQueryInput;
}>;

export type TorrentFilesQuery = {
  torrent: {
    files: {
      totalCount: number;
      hasNextPage: boolean | null;
      items: Array<{
        infoHash: string;
        index: number;
        path: string;
        size: number;
        fileType: Types.FileType | null;
        createdAt: string;
        updatedAt: string;
      }>;
    };
  };
};

export type TorrentMetricsQueryVariables = Exact<{
  input: Types.TorrentMetricsQueryInput;
}>;

export type TorrentMetricsQuery = {
  torrent: {
    metrics: {
      buckets: Array<{
        source: string;
        updated: boolean;
        bucket: string;
        count: number;
      }>;
    };
    listSources: { sources: Array<{ key: string; name: string }> };
  };
};

export type TorrentSuggestTagsQueryVariables = Exact<{
  input: Types.SuggestTagsQueryInput;
}>;

export type TorrentSuggestTagsQuery = {
  torrent: {
    suggestTags: { suggestions: Array<{ name: string; count: number }> };
  };
};

export type VersionQueryVariables = Exact<{ [key: string]: never }>;

export type VersionQuery = { version: string };

export const QueueJobFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "QueueJob" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "QueueJob" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "queue" } },
          { kind: "Field", name: { kind: "Name", value: "status" } },
          { kind: "Field", name: { kind: "Name", value: "payload" } },
          { kind: "Field", name: { kind: "Name", value: "priority" } },
          { kind: "Field", name: { kind: "Name", value: "retries" } },
          { kind: "Field", name: { kind: "Name", value: "maxRetries" } },
          { kind: "Field", name: { kind: "Name", value: "runAfter" } },
          { kind: "Field", name: { kind: "Name", value: "ranAt" } },
          { kind: "Field", name: { kind: "Name", value: "error" } },
          { kind: "Field", name: { kind: "Name", value: "createdAt" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<QueueJobFragment, unknown>;
export const QueueJobsQueryResultFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "QueueJobsQueryResult" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "QueueJobsQueryResult" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "items" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "QueueJob" },
                },
              ],
            },
          },
          { kind: "Field", name: { kind: "Name", value: "totalCount" } },
          { kind: "Field", name: { kind: "Name", value: "hasNextPage" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "aggregations" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "queue" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "value" } },
                      { kind: "Field", name: { kind: "Name", value: "label" } },
                      { kind: "Field", name: { kind: "Name", value: "count" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "status" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "value" } },
                      { kind: "Field", name: { kind: "Name", value: "label" } },
                      { kind: "Field", name: { kind: "Name", value: "count" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "QueueJob" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "QueueJob" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "queue" } },
          { kind: "Field", name: { kind: "Name", value: "status" } },
          { kind: "Field", name: { kind: "Name", value: "payload" } },
          { kind: "Field", name: { kind: "Name", value: "priority" } },
          { kind: "Field", name: { kind: "Name", value: "retries" } },
          { kind: "Field", name: { kind: "Name", value: "maxRetries" } },
          { kind: "Field", name: { kind: "Name", value: "runAfter" } },
          { kind: "Field", name: { kind: "Name", value: "ranAt" } },
          { kind: "Field", name: { kind: "Name", value: "error" } },
          { kind: "Field", name: { kind: "Name", value: "createdAt" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<QueueJobsQueryResultFragment, unknown>;
export const TorrentFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "Torrent" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "Torrent" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "infoHash" } },
          { kind: "Field", name: { kind: "Name", value: "name" } },
          { kind: "Field", name: { kind: "Name", value: "size" } },
          { kind: "Field", name: { kind: "Name", value: "filesStatus" } },
          { kind: "Field", name: { kind: "Name", value: "filesCount" } },
          { kind: "Field", name: { kind: "Name", value: "hasFilesInfo" } },
          { kind: "Field", name: { kind: "Name", value: "singleFile" } },
          { kind: "Field", name: { kind: "Name", value: "fileType" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "sources" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "key" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
          { kind: "Field", name: { kind: "Name", value: "seeders" } },
          { kind: "Field", name: { kind: "Name", value: "leechers" } },
          { kind: "Field", name: { kind: "Name", value: "tagNames" } },
          { kind: "Field", name: { kind: "Name", value: "magnetUri" } },
          { kind: "Field", name: { kind: "Name", value: "createdAt" } },
          { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<TorrentFragment, unknown>;
export const ContentFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "Content" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "Content" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "type" } },
          { kind: "Field", name: { kind: "Name", value: "source" } },
          { kind: "Field", name: { kind: "Name", value: "id" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "metadataSource" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "key" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
          { kind: "Field", name: { kind: "Name", value: "title" } },
          { kind: "Field", name: { kind: "Name", value: "releaseDate" } },
          { kind: "Field", name: { kind: "Name", value: "releaseYear" } },
          { kind: "Field", name: { kind: "Name", value: "overview" } },
          { kind: "Field", name: { kind: "Name", value: "runtime" } },
          { kind: "Field", name: { kind: "Name", value: "voteAverage" } },
          { kind: "Field", name: { kind: "Name", value: "voteCount" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "originalLanguage" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "attributes" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "metadataSource" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "key" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
                { kind: "Field", name: { kind: "Name", value: "source" } },
                { kind: "Field", name: { kind: "Name", value: "key" } },
                { kind: "Field", name: { kind: "Name", value: "value" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "collections" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "metadataSource" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "key" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
                { kind: "Field", name: { kind: "Name", value: "type" } },
                { kind: "Field", name: { kind: "Name", value: "source" } },
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "externalLinks" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "metadataSource" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "key" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
                { kind: "Field", name: { kind: "Name", value: "url" } },
              ],
            },
          },
          { kind: "Field", name: { kind: "Name", value: "createdAt" } },
          { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ContentFragment, unknown>;
export const TorrentContentFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "TorrentContent" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "TorrentContent" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "infoHash" } },
          { kind: "Field", name: { kind: "Name", value: "contentType" } },
          { kind: "Field", name: { kind: "Name", value: "title" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "torrent" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "Torrent" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "content" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "Content" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "languages" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "episodes" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "label" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "seasons" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "season" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "episodes" },
                      },
                    ],
                  },
                },
              ],
            },
          },
          { kind: "Field", name: { kind: "Name", value: "video3d" } },
          { kind: "Field", name: { kind: "Name", value: "videoCodec" } },
          { kind: "Field", name: { kind: "Name", value: "videoModifier" } },
          { kind: "Field", name: { kind: "Name", value: "videoResolution" } },
          { kind: "Field", name: { kind: "Name", value: "videoSource" } },
          { kind: "Field", name: { kind: "Name", value: "seeders" } },
          { kind: "Field", name: { kind: "Name", value: "leechers" } },
          { kind: "Field", name: { kind: "Name", value: "publishedAt" } },
          { kind: "Field", name: { kind: "Name", value: "createdAt" } },
          { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "Torrent" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "Torrent" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "infoHash" } },
          { kind: "Field", name: { kind: "Name", value: "name" } },
          { kind: "Field", name: { kind: "Name", value: "size" } },
          { kind: "Field", name: { kind: "Name", value: "filesStatus" } },
          { kind: "Field", name: { kind: "Name", value: "filesCount" } },
          { kind: "Field", name: { kind: "Name", value: "hasFilesInfo" } },
          { kind: "Field", name: { kind: "Name", value: "singleFile" } },
          { kind: "Field", name: { kind: "Name", value: "fileType" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "sources" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "key" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
          { kind: "Field", name: { kind: "Name", value: "seeders" } },
          { kind: "Field", name: { kind: "Name", value: "leechers" } },
          { kind: "Field", name: { kind: "Name", value: "tagNames" } },
          { kind: "Field", name: { kind: "Name", value: "magnetUri" } },
          { kind: "Field", name: { kind: "Name", value: "createdAt" } },
          { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "Content" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "Content" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "type" } },
          { kind: "Field", name: { kind: "Name", value: "source" } },
          { kind: "Field", name: { kind: "Name", value: "id" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "metadataSource" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "key" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
          { kind: "Field", name: { kind: "Name", value: "title" } },
          { kind: "Field", name: { kind: "Name", value: "releaseDate" } },
          { kind: "Field", name: { kind: "Name", value: "releaseYear" } },
          { kind: "Field", name: { kind: "Name", value: "overview" } },
          { kind: "Field", name: { kind: "Name", value: "runtime" } },
          { kind: "Field", name: { kind: "Name", value: "voteAverage" } },
          { kind: "Field", name: { kind: "Name", value: "voteCount" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "originalLanguage" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "attributes" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "metadataSource" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "key" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
                { kind: "Field", name: { kind: "Name", value: "source" } },
                { kind: "Field", name: { kind: "Name", value: "key" } },
                { kind: "Field", name: { kind: "Name", value: "value" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "collections" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "metadataSource" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "key" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
                { kind: "Field", name: { kind: "Name", value: "type" } },
                { kind: "Field", name: { kind: "Name", value: "source" } },
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "externalLinks" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "metadataSource" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "key" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
                { kind: "Field", name: { kind: "Name", value: "url" } },
              ],
            },
          },
          { kind: "Field", name: { kind: "Name", value: "createdAt" } },
          { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<TorrentContentFragment, unknown>;
export const TorrentContentSearchResultFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "TorrentContentSearchResult" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "TorrentContentSearchResult" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "items" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "TorrentContent" },
                },
              ],
            },
          },
          { kind: "Field", name: { kind: "Name", value: "totalCount" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "totalCountIsEstimate" },
          },
          { kind: "Field", name: { kind: "Name", value: "hasNextPage" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "aggregations" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "contentType" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "value" } },
                      { kind: "Field", name: { kind: "Name", value: "label" } },
                      { kind: "Field", name: { kind: "Name", value: "count" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "isEstimate" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "torrentSource" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "value" } },
                      { kind: "Field", name: { kind: "Name", value: "label" } },
                      { kind: "Field", name: { kind: "Name", value: "count" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "isEstimate" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "torrentTag" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "value" } },
                      { kind: "Field", name: { kind: "Name", value: "label" } },
                      { kind: "Field", name: { kind: "Name", value: "count" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "isEstimate" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "torrentFileType" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "value" } },
                      { kind: "Field", name: { kind: "Name", value: "label" } },
                      { kind: "Field", name: { kind: "Name", value: "count" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "isEstimate" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "language" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "value" } },
                      { kind: "Field", name: { kind: "Name", value: "label" } },
                      { kind: "Field", name: { kind: "Name", value: "count" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "isEstimate" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "genre" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "value" } },
                      { kind: "Field", name: { kind: "Name", value: "label" } },
                      { kind: "Field", name: { kind: "Name", value: "count" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "isEstimate" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "releaseYear" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "value" } },
                      { kind: "Field", name: { kind: "Name", value: "label" } },
                      { kind: "Field", name: { kind: "Name", value: "count" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "isEstimate" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "videoResolution" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "value" } },
                      { kind: "Field", name: { kind: "Name", value: "label" } },
                      { kind: "Field", name: { kind: "Name", value: "count" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "isEstimate" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "videoSource" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "value" } },
                      { kind: "Field", name: { kind: "Name", value: "label" } },
                      { kind: "Field", name: { kind: "Name", value: "count" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "isEstimate" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "Torrent" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "Torrent" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "infoHash" } },
          { kind: "Field", name: { kind: "Name", value: "name" } },
          { kind: "Field", name: { kind: "Name", value: "size" } },
          { kind: "Field", name: { kind: "Name", value: "filesStatus" } },
          { kind: "Field", name: { kind: "Name", value: "filesCount" } },
          { kind: "Field", name: { kind: "Name", value: "hasFilesInfo" } },
          { kind: "Field", name: { kind: "Name", value: "singleFile" } },
          { kind: "Field", name: { kind: "Name", value: "fileType" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "sources" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "key" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
          { kind: "Field", name: { kind: "Name", value: "seeders" } },
          { kind: "Field", name: { kind: "Name", value: "leechers" } },
          { kind: "Field", name: { kind: "Name", value: "tagNames" } },
          { kind: "Field", name: { kind: "Name", value: "magnetUri" } },
          { kind: "Field", name: { kind: "Name", value: "createdAt" } },
          { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "Content" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "Content" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "type" } },
          { kind: "Field", name: { kind: "Name", value: "source" } },
          { kind: "Field", name: { kind: "Name", value: "id" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "metadataSource" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "key" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
          { kind: "Field", name: { kind: "Name", value: "title" } },
          { kind: "Field", name: { kind: "Name", value: "releaseDate" } },
          { kind: "Field", name: { kind: "Name", value: "releaseYear" } },
          { kind: "Field", name: { kind: "Name", value: "overview" } },
          { kind: "Field", name: { kind: "Name", value: "runtime" } },
          { kind: "Field", name: { kind: "Name", value: "voteAverage" } },
          { kind: "Field", name: { kind: "Name", value: "voteCount" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "originalLanguage" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "attributes" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "metadataSource" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "key" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
                { kind: "Field", name: { kind: "Name", value: "source" } },
                { kind: "Field", name: { kind: "Name", value: "key" } },
                { kind: "Field", name: { kind: "Name", value: "value" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "collections" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "metadataSource" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "key" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
                { kind: "Field", name: { kind: "Name", value: "type" } },
                { kind: "Field", name: { kind: "Name", value: "source" } },
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "externalLinks" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "metadataSource" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "key" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
                { kind: "Field", name: { kind: "Name", value: "url" } },
              ],
            },
          },
          { kind: "Field", name: { kind: "Name", value: "createdAt" } },
          { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "TorrentContent" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "TorrentContent" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "infoHash" } },
          { kind: "Field", name: { kind: "Name", value: "contentType" } },
          { kind: "Field", name: { kind: "Name", value: "title" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "torrent" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "Torrent" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "content" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "Content" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "languages" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "episodes" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "label" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "seasons" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "season" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "episodes" },
                      },
                    ],
                  },
                },
              ],
            },
          },
          { kind: "Field", name: { kind: "Name", value: "video3d" } },
          { kind: "Field", name: { kind: "Name", value: "videoCodec" } },
          { kind: "Field", name: { kind: "Name", value: "videoModifier" } },
          { kind: "Field", name: { kind: "Name", value: "videoResolution" } },
          { kind: "Field", name: { kind: "Name", value: "videoSource" } },
          { kind: "Field", name: { kind: "Name", value: "seeders" } },
          { kind: "Field", name: { kind: "Name", value: "leechers" } },
          { kind: "Field", name: { kind: "Name", value: "publishedAt" } },
          { kind: "Field", name: { kind: "Name", value: "createdAt" } },
          { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<TorrentContentSearchResultFragment, unknown>;
export const TorrentFileFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "TorrentFile" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "TorrentFile" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "infoHash" } },
          { kind: "Field", name: { kind: "Name", value: "index" } },
          { kind: "Field", name: { kind: "Name", value: "path" } },
          { kind: "Field", name: { kind: "Name", value: "size" } },
          { kind: "Field", name: { kind: "Name", value: "fileType" } },
          { kind: "Field", name: { kind: "Name", value: "createdAt" } },
          { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<TorrentFileFragment, unknown>;
export const TorrentFilesQueryResultFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "TorrentFilesQueryResult" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "TorrentFilesQueryResult" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "items" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "TorrentFile" },
                },
              ],
            },
          },
          { kind: "Field", name: { kind: "Name", value: "totalCount" } },
          { kind: "Field", name: { kind: "Name", value: "hasNextPage" } },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "TorrentFile" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "TorrentFile" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "infoHash" } },
          { kind: "Field", name: { kind: "Name", value: "index" } },
          { kind: "Field", name: { kind: "Name", value: "path" } },
          { kind: "Field", name: { kind: "Name", value: "size" } },
          { kind: "Field", name: { kind: "Name", value: "fileType" } },
          { kind: "Field", name: { kind: "Name", value: "createdAt" } },
          { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<TorrentFilesQueryResultFragment, unknown>;
export const QueueEnqueueReprocessTorrentsBatchDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "QueueEnqueueReprocessTorrentsBatch" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "input" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "QueueEnqueueReprocessTorrentsBatchInput",
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "queue" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: {
                    kind: "Name",
                    value: "enqueueReprocessTorrentsBatch",
                  },
                  arguments: [
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "input" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "input" },
                      },
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  QueueEnqueueReprocessTorrentsBatchMutation,
  QueueEnqueueReprocessTorrentsBatchMutationVariables
>;
export const QueuePurgeJobsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "QueuePurgeJobs" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "input" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "QueuePurgeJobsInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "queue" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "purgeJobs" },
                  arguments: [
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "input" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "input" },
                      },
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  QueuePurgeJobsMutation,
  QueuePurgeJobsMutationVariables
>;
export const TorrentDeleteDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "TorrentDelete" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "infoHashes" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: { kind: "Name", value: "Hash20" },
                },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "torrent" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "delete" },
                  arguments: [
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "infoHashes" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "infoHashes" },
                      },
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  TorrentDeleteMutation,
  TorrentDeleteMutationVariables
>;
export const TorrentDeleteTagsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "TorrentDeleteTags" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "infoHashes" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "Hash20" },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "tagNames" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "String" },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "torrent" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "deleteTags" },
                  arguments: [
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "infoHashes" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "infoHashes" },
                      },
                    },
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "tagNames" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "tagNames" },
                      },
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  TorrentDeleteTagsMutation,
  TorrentDeleteTagsMutationVariables
>;
export const TorrentPutTagsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "TorrentPutTags" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "infoHashes" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: { kind: "Name", value: "Hash20" },
                },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "tagNames" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: { kind: "Name", value: "String" },
                },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "torrent" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "putTags" },
                  arguments: [
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "infoHashes" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "infoHashes" },
                      },
                    },
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "tagNames" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "tagNames" },
                      },
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  TorrentPutTagsMutation,
  TorrentPutTagsMutationVariables
>;
export const TorrentReprocessDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "TorrentReprocess" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "input" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "TorrentReprocessInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "torrent" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "reprocess" },
                  arguments: [
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "input" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "input" },
                      },
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  TorrentReprocessMutation,
  TorrentReprocessMutationVariables
>;
export const TorrentSetTagsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "TorrentSetTags" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "infoHashes" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: { kind: "Name", value: "Hash20" },
                },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "tagNames" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: { kind: "Name", value: "String" },
                },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "torrent" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "setTags" },
                  arguments: [
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "infoHashes" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "infoHashes" },
                      },
                    },
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "tagNames" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "tagNames" },
                      },
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  TorrentSetTagsMutation,
  TorrentSetTagsMutationVariables
>;
export const HealthCheckDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "HealthCheck" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "health" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "status" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "checks" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "key" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "status" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "timestamp" },
                      },
                      { kind: "Field", name: { kind: "Name", value: "error" } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "workers" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "listAll" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "workers" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "key" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "started" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<HealthCheckQuery, HealthCheckQueryVariables>;
export const QueueJobsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "QueueJobs" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "input" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "QueueJobsQueryInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "queue" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "jobs" },
                  arguments: [
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "input" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "input" },
                      },
                    },
                  ],
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "FragmentSpread",
                        name: { kind: "Name", value: "QueueJobsQueryResult" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "QueueJob" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "QueueJob" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "queue" } },
          { kind: "Field", name: { kind: "Name", value: "status" } },
          { kind: "Field", name: { kind: "Name", value: "payload" } },
          { kind: "Field", name: { kind: "Name", value: "priority" } },
          { kind: "Field", name: { kind: "Name", value: "retries" } },
          { kind: "Field", name: { kind: "Name", value: "maxRetries" } },
          { kind: "Field", name: { kind: "Name", value: "runAfter" } },
          { kind: "Field", name: { kind: "Name", value: "ranAt" } },
          { kind: "Field", name: { kind: "Name", value: "error" } },
          { kind: "Field", name: { kind: "Name", value: "createdAt" } },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "QueueJobsQueryResult" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "QueueJobsQueryResult" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "items" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "QueueJob" },
                },
              ],
            },
          },
          { kind: "Field", name: { kind: "Name", value: "totalCount" } },
          { kind: "Field", name: { kind: "Name", value: "hasNextPage" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "aggregations" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "queue" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "value" } },
                      { kind: "Field", name: { kind: "Name", value: "label" } },
                      { kind: "Field", name: { kind: "Name", value: "count" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "status" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "value" } },
                      { kind: "Field", name: { kind: "Name", value: "label" } },
                      { kind: "Field", name: { kind: "Name", value: "count" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<QueueJobsQuery, QueueJobsQueryVariables>;
export const QueueMetricsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "QueueMetrics" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "input" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "QueueMetricsQueryInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "queue" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "metrics" },
                  arguments: [
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "input" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "input" },
                      },
                    },
                  ],
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "buckets" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "queue" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "status" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "createdAtBucket" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "ranAtBucket" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "count" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "latency" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<QueueMetricsQuery, QueueMetricsQueryVariables>;
export const TorrentContentSearchDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "TorrentContentSearch" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "input" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "TorrentContentSearchQueryInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "torrentContent" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "search" },
                  arguments: [
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "input" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "input" },
                      },
                    },
                  ],
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "FragmentSpread",
                        name: {
                          kind: "Name",
                          value: "TorrentContentSearchResult",
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "Torrent" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "Torrent" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "infoHash" } },
          { kind: "Field", name: { kind: "Name", value: "name" } },
          { kind: "Field", name: { kind: "Name", value: "size" } },
          { kind: "Field", name: { kind: "Name", value: "filesStatus" } },
          { kind: "Field", name: { kind: "Name", value: "filesCount" } },
          { kind: "Field", name: { kind: "Name", value: "hasFilesInfo" } },
          { kind: "Field", name: { kind: "Name", value: "singleFile" } },
          { kind: "Field", name: { kind: "Name", value: "fileType" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "sources" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "key" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
          { kind: "Field", name: { kind: "Name", value: "seeders" } },
          { kind: "Field", name: { kind: "Name", value: "leechers" } },
          { kind: "Field", name: { kind: "Name", value: "tagNames" } },
          { kind: "Field", name: { kind: "Name", value: "magnetUri" } },
          { kind: "Field", name: { kind: "Name", value: "createdAt" } },
          { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "Content" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "Content" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "type" } },
          { kind: "Field", name: { kind: "Name", value: "source" } },
          { kind: "Field", name: { kind: "Name", value: "id" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "metadataSource" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "key" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
          { kind: "Field", name: { kind: "Name", value: "title" } },
          { kind: "Field", name: { kind: "Name", value: "releaseDate" } },
          { kind: "Field", name: { kind: "Name", value: "releaseYear" } },
          { kind: "Field", name: { kind: "Name", value: "overview" } },
          { kind: "Field", name: { kind: "Name", value: "runtime" } },
          { kind: "Field", name: { kind: "Name", value: "voteAverage" } },
          { kind: "Field", name: { kind: "Name", value: "voteCount" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "originalLanguage" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "attributes" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "metadataSource" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "key" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
                { kind: "Field", name: { kind: "Name", value: "source" } },
                { kind: "Field", name: { kind: "Name", value: "key" } },
                { kind: "Field", name: { kind: "Name", value: "value" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "collections" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "metadataSource" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "key" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
                { kind: "Field", name: { kind: "Name", value: "type" } },
                { kind: "Field", name: { kind: "Name", value: "source" } },
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "externalLinks" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "metadataSource" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "key" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
                { kind: "Field", name: { kind: "Name", value: "url" } },
              ],
            },
          },
          { kind: "Field", name: { kind: "Name", value: "createdAt" } },
          { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "TorrentContent" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "TorrentContent" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "infoHash" } },
          { kind: "Field", name: { kind: "Name", value: "contentType" } },
          { kind: "Field", name: { kind: "Name", value: "title" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "torrent" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "Torrent" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "content" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "Content" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "languages" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "episodes" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "label" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "seasons" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "season" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "episodes" },
                      },
                    ],
                  },
                },
              ],
            },
          },
          { kind: "Field", name: { kind: "Name", value: "video3d" } },
          { kind: "Field", name: { kind: "Name", value: "videoCodec" } },
          { kind: "Field", name: { kind: "Name", value: "videoModifier" } },
          { kind: "Field", name: { kind: "Name", value: "videoResolution" } },
          { kind: "Field", name: { kind: "Name", value: "videoSource" } },
          { kind: "Field", name: { kind: "Name", value: "seeders" } },
          { kind: "Field", name: { kind: "Name", value: "leechers" } },
          { kind: "Field", name: { kind: "Name", value: "publishedAt" } },
          { kind: "Field", name: { kind: "Name", value: "createdAt" } },
          { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "TorrentContentSearchResult" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "TorrentContentSearchResult" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "items" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "TorrentContent" },
                },
              ],
            },
          },
          { kind: "Field", name: { kind: "Name", value: "totalCount" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "totalCountIsEstimate" },
          },
          { kind: "Field", name: { kind: "Name", value: "hasNextPage" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "aggregations" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "contentType" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "value" } },
                      { kind: "Field", name: { kind: "Name", value: "label" } },
                      { kind: "Field", name: { kind: "Name", value: "count" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "isEstimate" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "torrentSource" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "value" } },
                      { kind: "Field", name: { kind: "Name", value: "label" } },
                      { kind: "Field", name: { kind: "Name", value: "count" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "isEstimate" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "torrentTag" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "value" } },
                      { kind: "Field", name: { kind: "Name", value: "label" } },
                      { kind: "Field", name: { kind: "Name", value: "count" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "isEstimate" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "torrentFileType" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "value" } },
                      { kind: "Field", name: { kind: "Name", value: "label" } },
                      { kind: "Field", name: { kind: "Name", value: "count" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "isEstimate" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "language" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "value" } },
                      { kind: "Field", name: { kind: "Name", value: "label" } },
                      { kind: "Field", name: { kind: "Name", value: "count" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "isEstimate" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "genre" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "value" } },
                      { kind: "Field", name: { kind: "Name", value: "label" } },
                      { kind: "Field", name: { kind: "Name", value: "count" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "isEstimate" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "releaseYear" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "value" } },
                      { kind: "Field", name: { kind: "Name", value: "label" } },
                      { kind: "Field", name: { kind: "Name", value: "count" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "isEstimate" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "videoResolution" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "value" } },
                      { kind: "Field", name: { kind: "Name", value: "label" } },
                      { kind: "Field", name: { kind: "Name", value: "count" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "isEstimate" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "videoSource" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "value" } },
                      { kind: "Field", name: { kind: "Name", value: "label" } },
                      { kind: "Field", name: { kind: "Name", value: "count" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "isEstimate" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  TorrentContentSearchQuery,
  TorrentContentSearchQueryVariables
>;
export const TorrentFilesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "TorrentFiles" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "input" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "TorrentFilesQueryInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "torrent" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "files" },
                  arguments: [
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "input" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "input" },
                      },
                    },
                  ],
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "FragmentSpread",
                        name: {
                          kind: "Name",
                          value: "TorrentFilesQueryResult",
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "TorrentFile" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "TorrentFile" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "infoHash" } },
          { kind: "Field", name: { kind: "Name", value: "index" } },
          { kind: "Field", name: { kind: "Name", value: "path" } },
          { kind: "Field", name: { kind: "Name", value: "size" } },
          { kind: "Field", name: { kind: "Name", value: "fileType" } },
          { kind: "Field", name: { kind: "Name", value: "createdAt" } },
          { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "TorrentFilesQueryResult" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "TorrentFilesQueryResult" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "items" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "TorrentFile" },
                },
              ],
            },
          },
          { kind: "Field", name: { kind: "Name", value: "totalCount" } },
          { kind: "Field", name: { kind: "Name", value: "hasNextPage" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<TorrentFilesQuery, TorrentFilesQueryVariables>;
export const TorrentMetricsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "TorrentMetrics" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "input" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "TorrentMetricsQueryInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "torrent" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "metrics" },
                  arguments: [
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "input" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "input" },
                      },
                    },
                  ],
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "buckets" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "source" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "updated" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "bucket" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "count" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "listSources" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "sources" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "key" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<TorrentMetricsQuery, TorrentMetricsQueryVariables>;
export const TorrentSuggestTagsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "TorrentSuggestTags" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "input" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "SuggestTagsQueryInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "torrent" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "suggestTags" },
                  arguments: [
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "input" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "input" },
                      },
                    },
                  ],
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "suggestions" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "count" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  TorrentSuggestTagsQuery,
  TorrentSuggestTagsQueryVariables
>;
export const VersionDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "Version" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "version" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<VersionQuery, VersionQueryVariables>;
