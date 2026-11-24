export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  Date: { input: string; output: string };
  DateTime: { input: string; output: string };
  Duration: { input: string; output: string };
  Hash20: { input: string; output: string };
  Void: { input: void; output: void };
  Year: { input: number; output: number };
};

export type Content = {
  __typename?: "Content";
  adult?: Maybe<Scalars["Boolean"]["output"]>;
  attributes: Array<ContentAttribute>;
  collections: Array<ContentCollection>;
  createdAt: Scalars["DateTime"]["output"];
  externalLinks: Array<ExternalLink>;
  id: Scalars["String"]["output"];
  metadataSource: MetadataSource;
  originalLanguage?: Maybe<LanguageInfo>;
  originalTitle?: Maybe<Scalars["String"]["output"]>;
  overview?: Maybe<Scalars["String"]["output"]>;
  popularity?: Maybe<Scalars["Float"]["output"]>;
  releaseDate?: Maybe<Scalars["Date"]["output"]>;
  releaseYear?: Maybe<Scalars["Year"]["output"]>;
  runtime?: Maybe<Scalars["Int"]["output"]>;
  source: Scalars["String"]["output"];
  title: Scalars["String"]["output"];
  type: ContentType;
  updatedAt: Scalars["DateTime"]["output"];
  voteAverage?: Maybe<Scalars["Float"]["output"]>;
  voteCount?: Maybe<Scalars["Int"]["output"]>;
};

export type ContentAttribute = {
  __typename?: "ContentAttribute";
  createdAt: Scalars["DateTime"]["output"];
  key: Scalars["String"]["output"];
  metadataSource: MetadataSource;
  source: Scalars["String"]["output"];
  updatedAt: Scalars["DateTime"]["output"];
  value: Scalars["String"]["output"];
};

export type ContentCollection = {
  __typename?: "ContentCollection";
  createdAt: Scalars["DateTime"]["output"];
  id: Scalars["String"]["output"];
  metadataSource: MetadataSource;
  name: Scalars["String"]["output"];
  source: Scalars["String"]["output"];
  type: Scalars["String"]["output"];
  updatedAt: Scalars["DateTime"]["output"];
};

export type ContentType =
  | "audiobook"
  | "comic"
  | "ebook"
  | "game"
  | "movie"
  | "music"
  | "software"
  | "tv_show"
  | "xxx";

export type ContentTypeAgg = {
  __typename?: "ContentTypeAgg";
  count: Scalars["Int"]["output"];
  isEstimate: Scalars["Boolean"]["output"];
  label: Scalars["String"]["output"];
  value?: Maybe<ContentType>;
};

export type ContentTypeFacetInput = {
  aggregate?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Array<InputMaybe<ContentType>>>;
};

export type Episodes = {
  __typename?: "Episodes";
  label: Scalars["String"]["output"];
  seasons: Array<Season>;
};

export type ExternalLink = {
  __typename?: "ExternalLink";
  metadataSource: MetadataSource;
  url: Scalars["String"]["output"];
};

export type FacetLogic = "and" | "or";

export type FileType =
  | "archive"
  | "audio"
  | "data"
  | "document"
  | "image"
  | "software"
  | "subtitles"
  | "video";

export type FilesStatus = "multi" | "no_info" | "over_threshold" | "single";

export type GenreAgg = {
  __typename?: "GenreAgg";
  count: Scalars["Int"]["output"];
  isEstimate: Scalars["Boolean"]["output"];
  label: Scalars["String"]["output"];
  value: Scalars["String"]["output"];
};

export type GenreFacetInput = {
  aggregate?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Array<Scalars["String"]["input"]>>;
  logic?: InputMaybe<FacetLogic>;
};

export type HealthCheck = {
  __typename?: "HealthCheck";
  error?: Maybe<Scalars["String"]["output"]>;
  key: Scalars["String"]["output"];
  status: HealthStatus;
  timestamp: Scalars["DateTime"]["output"];
};

export type HealthQuery = {
  __typename?: "HealthQuery";
  checks: Array<HealthCheck>;
  status: HealthStatus;
};

export type HealthStatus = "down" | "inactive" | "unknown" | "up";

export type Language =
  | "af"
  | "ar"
  | "az"
  | "be"
  | "bg"
  | "bs"
  | "ca"
  | "ce"
  | "co"
  | "cs"
  | "cy"
  | "da"
  | "de"
  | "el"
  | "en"
  | "es"
  | "et"
  | "eu"
  | "fa"
  | "fi"
  | "fr"
  | "he"
  | "hi"
  | "hr"
  | "hu"
  | "hy"
  | "id"
  | "is"
  | "it"
  | "ja"
  | "ka"
  | "ko"
  | "ku"
  | "lt"
  | "lv"
  | "mi"
  | "mk"
  | "ml"
  | "mn"
  | "ms"
  | "mt"
  | "nl"
  | "no"
  | "pl"
  | "pt"
  | "ro"
  | "ru"
  | "sa"
  | "sk"
  | "sl"
  | "sm"
  | "so"
  | "sr"
  | "sv"
  | "ta"
  | "th"
  | "tr"
  | "uk"
  | "vi"
  | "yi"
  | "zh"
  | "zu";

export type LanguageAgg = {
  __typename?: "LanguageAgg";
  count: Scalars["Int"]["output"];
  isEstimate: Scalars["Boolean"]["output"];
  label: Scalars["String"]["output"];
  value: Language;
};

export type LanguageFacetInput = {
  aggregate?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Array<Language>>;
};

export type LanguageInfo = {
  __typename?: "LanguageInfo";
  id: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
};

export type MetadataSource = {
  __typename?: "MetadataSource";
  key: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
};

export type MetricsBucketDuration = "day" | "hour" | "minute";

export type Mutation = {
  __typename?: "Mutation";
  queue: QueueMutation;
  torrent: TorrentMutation;
};

export type Query = {
  __typename?: "Query";
  health: HealthQuery;
  queue: QueueQuery;
  torrent: TorrentQuery;
  torrentContent: TorrentContentQuery;
  version: Scalars["String"]["output"];
  workers: WorkersQuery;
};

export type QueueEnqueueReprocessTorrentsBatchInput = {
  apisDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  batchSize?: InputMaybe<Scalars["Int"]["input"]>;
  chunkSize?: InputMaybe<Scalars["Int"]["input"]>;
  classifierRematch?: InputMaybe<Scalars["Boolean"]["input"]>;
  classifierWorkflow?: InputMaybe<Scalars["String"]["input"]>;
  contentTypes?: InputMaybe<Array<InputMaybe<ContentType>>>;
  localSearchDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  orphans?: InputMaybe<Scalars["Boolean"]["input"]>;
  purge?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type QueueJob = {
  __typename?: "QueueJob";
  createdAt: Scalars["DateTime"]["output"];
  error?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  maxRetries: Scalars["Int"]["output"];
  payload: Scalars["String"]["output"];
  priority: Scalars["Int"]["output"];
  queue: Scalars["String"]["output"];
  ranAt?: Maybe<Scalars["DateTime"]["output"]>;
  retries: Scalars["Int"]["output"];
  runAfter: Scalars["DateTime"]["output"];
  status: QueueJobStatus;
};

export type QueueJobQueueAgg = {
  __typename?: "QueueJobQueueAgg";
  count: Scalars["Int"]["output"];
  label: Scalars["String"]["output"];
  value: Scalars["String"]["output"];
};

export type QueueJobQueueFacetInput = {
  aggregate?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

export type QueueJobStatus = "failed" | "pending" | "processed" | "retry";

export type QueueJobStatusAgg = {
  __typename?: "QueueJobStatusAgg";
  count: Scalars["Int"]["output"];
  label: Scalars["String"]["output"];
  value: QueueJobStatus;
};

export type QueueJobStatusFacetInput = {
  aggregate?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Array<QueueJobStatus>>;
};

export type QueueJobsAggregations = {
  __typename?: "QueueJobsAggregations";
  queue?: Maybe<Array<QueueJobQueueAgg>>;
  status?: Maybe<Array<QueueJobStatusAgg>>;
};

export type QueueJobsFacetsInput = {
  queue?: InputMaybe<QueueJobQueueFacetInput>;
  status?: InputMaybe<QueueJobStatusFacetInput>;
};

export type QueueJobsOrderByField = "created_at" | "priority" | "ran_at";

export type QueueJobsOrderByInput = {
  descending?: InputMaybe<Scalars["Boolean"]["input"]>;
  field: QueueJobsOrderByField;
};

export type QueueJobsQueryInput = {
  facets?: InputMaybe<QueueJobsFacetsInput>;
  hasNextPage?: InputMaybe<Scalars["Boolean"]["input"]>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<QueueJobsOrderByInput>>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
  queues?: InputMaybe<Array<Scalars["String"]["input"]>>;
  statuses?: InputMaybe<Array<QueueJobStatus>>;
  totalCount?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type QueueJobsQueryResult = {
  __typename?: "QueueJobsQueryResult";
  aggregations: QueueJobsAggregations;
  hasNextPage?: Maybe<Scalars["Boolean"]["output"]>;
  items: Array<QueueJob>;
  totalCount: Scalars["Int"]["output"];
};

export type QueueMetricsBucket = {
  __typename?: "QueueMetricsBucket";
  count: Scalars["Int"]["output"];
  createdAtBucket: Scalars["DateTime"]["output"];
  latency?: Maybe<Scalars["Duration"]["output"]>;
  queue: Scalars["String"]["output"];
  ranAtBucket?: Maybe<Scalars["DateTime"]["output"]>;
  status: QueueJobStatus;
};

export type QueueMetricsQueryInput = {
  bucketDuration: MetricsBucketDuration;
  endTime?: InputMaybe<Scalars["DateTime"]["input"]>;
  queues?: InputMaybe<Array<Scalars["String"]["input"]>>;
  startTime?: InputMaybe<Scalars["DateTime"]["input"]>;
  statuses?: InputMaybe<Array<QueueJobStatus>>;
};

export type QueueMetricsQueryResult = {
  __typename?: "QueueMetricsQueryResult";
  buckets: Array<QueueMetricsBucket>;
};

export type QueueMutation = {
  __typename?: "QueueMutation";
  enqueueReprocessTorrentsBatch?: Maybe<Scalars["Void"]["output"]>;
  purgeJobs?: Maybe<Scalars["Void"]["output"]>;
};

export type QueueMutationEnqueueReprocessTorrentsBatchArgs = {
  input?: InputMaybe<QueueEnqueueReprocessTorrentsBatchInput>;
};

export type QueueMutationPurgeJobsArgs = {
  input: QueuePurgeJobsInput;
};

export type QueuePurgeJobsInput = {
  queues?: InputMaybe<Array<Scalars["String"]["input"]>>;
  statuses?: InputMaybe<Array<QueueJobStatus>>;
};

export type QueueQuery = {
  __typename?: "QueueQuery";
  jobs: QueueJobsQueryResult;
  metrics: QueueMetricsQueryResult;
};

export type QueueQueryJobsArgs = {
  input: QueueJobsQueryInput;
};

export type QueueQueryMetricsArgs = {
  input: QueueMetricsQueryInput;
};

export type ReleaseYearAgg = {
  __typename?: "ReleaseYearAgg";
  count: Scalars["Int"]["output"];
  isEstimate: Scalars["Boolean"]["output"];
  label: Scalars["String"]["output"];
  value?: Maybe<Scalars["Year"]["output"]>;
};

export type ReleaseYearFacetInput = {
  aggregate?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Array<InputMaybe<Scalars["Year"]["input"]>>>;
};

export type Season = {
  __typename?: "Season";
  episodes?: Maybe<Array<Scalars["Int"]["output"]>>;
  season: Scalars["Int"]["output"];
};

export type SuggestTagsQueryInput = {
  exclusions?: InputMaybe<Array<Scalars["String"]["input"]>>;
  prefix?: InputMaybe<Scalars["String"]["input"]>;
};

export type SuggestedTag = {
  __typename?: "SuggestedTag";
  count: Scalars["Int"]["output"];
  name: Scalars["String"]["output"];
};

export type Torrent = {
  __typename?: "Torrent";
  createdAt: Scalars["DateTime"]["output"];
  extension?: Maybe<Scalars["String"]["output"]>;
  fileType?: Maybe<FileType>;
  fileTypes?: Maybe<Array<FileType>>;
  files?: Maybe<Array<TorrentFile>>;
  filesCount?: Maybe<Scalars["Int"]["output"]>;
  filesStatus: FilesStatus;
  hasFilesInfo: Scalars["Boolean"]["output"];
  infoHash: Scalars["Hash20"]["output"];
  leechers?: Maybe<Scalars["Int"]["output"]>;
  magnetUri: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
  seeders?: Maybe<Scalars["Int"]["output"]>;
  singleFile?: Maybe<Scalars["Boolean"]["output"]>;
  size: Scalars["Int"]["output"];
  sources: Array<TorrentSourceInfo>;
  tagNames: Array<Scalars["String"]["output"]>;
  updatedAt: Scalars["DateTime"]["output"];
};

export type TorrentContent = {
  __typename?: "TorrentContent";
  content?: Maybe<Content>;
  contentId?: Maybe<Scalars["String"]["output"]>;
  contentSource?: Maybe<Scalars["String"]["output"]>;
  contentType?: Maybe<ContentType>;
  createdAt: Scalars["DateTime"]["output"];
  episodes?: Maybe<Episodes>;
  id: Scalars["ID"]["output"];
  infoHash: Scalars["Hash20"]["output"];
  languages?: Maybe<Array<LanguageInfo>>;
  leechers?: Maybe<Scalars["Int"]["output"]>;
  publishedAt: Scalars["DateTime"]["output"];
  releaseGroup?: Maybe<Scalars["String"]["output"]>;
  seeders?: Maybe<Scalars["Int"]["output"]>;
  title: Scalars["String"]["output"];
  torrent: Torrent;
  updatedAt: Scalars["DateTime"]["output"];
  video3d?: Maybe<Video3D>;
  videoCodec?: Maybe<VideoCodec>;
  videoModifier?: Maybe<VideoModifier>;
  videoResolution?: Maybe<VideoResolution>;
  videoSource?: Maybe<VideoSource>;
};

export type TorrentContentAggregations = {
  __typename?: "TorrentContentAggregations";
  contentType?: Maybe<Array<ContentTypeAgg>>;
  genre?: Maybe<Array<GenreAgg>>;
  language?: Maybe<Array<LanguageAgg>>;
  releaseYear?: Maybe<Array<ReleaseYearAgg>>;
  torrentFileType?: Maybe<Array<TorrentFileTypeAgg>>;
  torrentSource?: Maybe<Array<TorrentSourceAgg>>;
  torrentTag?: Maybe<Array<TorrentTagAgg>>;
  videoResolution?: Maybe<Array<VideoResolutionAgg>>;
  videoSource?: Maybe<Array<VideoSourceAgg>>;
};

export type TorrentContentFacetsInput = {
  contentType?: InputMaybe<ContentTypeFacetInput>;
  genre?: InputMaybe<GenreFacetInput>;
  language?: InputMaybe<LanguageFacetInput>;
  releaseYear?: InputMaybe<ReleaseYearFacetInput>;
  torrentFileType?: InputMaybe<TorrentFileTypeFacetInput>;
  torrentSource?: InputMaybe<TorrentSourceFacetInput>;
  torrentTag?: InputMaybe<TorrentTagFacetInput>;
  videoResolution?: InputMaybe<VideoResolutionFacetInput>;
  videoSource?: InputMaybe<VideoSourceFacetInput>;
};

export type TorrentContentOrderByField =
  | "files_count"
  | "info_hash"
  | "leechers"
  | "name"
  | "published_at"
  | "relevance"
  | "seeders"
  | "size"
  | "updated_at";

export type TorrentContentOrderByInput = {
  descending?: InputMaybe<Scalars["Boolean"]["input"]>;
  field: TorrentContentOrderByField;
};

export type TorrentContentQuery = {
  __typename?: "TorrentContentQuery";
  search: TorrentContentSearchResult;
};

export type TorrentContentQuerySearchArgs = {
  input: TorrentContentSearchQueryInput;
};

export type TorrentContentSearchQueryInput = {
  aggregationBudget?: InputMaybe<Scalars["Float"]["input"]>;
  cached?: InputMaybe<Scalars["Boolean"]["input"]>;
  facets?: InputMaybe<TorrentContentFacetsInput>;
  /** hasNextPage if true, the search result will include the hasNextPage field, indicating if there are more results to fetch */
  hasNextPage?: InputMaybe<Scalars["Boolean"]["input"]>;
  infoHashes?: InputMaybe<Array<Scalars["Hash20"]["input"]>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<TorrentContentOrderByInput>>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
  queryString?: InputMaybe<Scalars["String"]["input"]>;
  totalCount?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type TorrentContentSearchResult = {
  __typename?: "TorrentContentSearchResult";
  aggregations: TorrentContentAggregations;
  /** hasNextPage is true if there are more results to fetch */
  hasNextPage?: Maybe<Scalars["Boolean"]["output"]>;
  items: Array<TorrentContent>;
  totalCount: Scalars["Int"]["output"];
  totalCountIsEstimate: Scalars["Boolean"]["output"];
};

export type TorrentFile = {
  __typename?: "TorrentFile";
  createdAt: Scalars["DateTime"]["output"];
  extension?: Maybe<Scalars["String"]["output"]>;
  fileType?: Maybe<FileType>;
  index: Scalars["Int"]["output"];
  infoHash: Scalars["Hash20"]["output"];
  path: Scalars["String"]["output"];
  size: Scalars["Int"]["output"];
  updatedAt: Scalars["DateTime"]["output"];
};

export type TorrentFileTypeAgg = {
  __typename?: "TorrentFileTypeAgg";
  count: Scalars["Int"]["output"];
  isEstimate: Scalars["Boolean"]["output"];
  label: Scalars["String"]["output"];
  value: FileType;
};

export type TorrentFileTypeFacetInput = {
  aggregate?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Array<FileType>>;
  logic?: InputMaybe<FacetLogic>;
};

export type TorrentFilesOrderByField = "extension" | "index" | "path" | "size";

export type TorrentFilesOrderByInput = {
  descending?: InputMaybe<Scalars["Boolean"]["input"]>;
  field: TorrentFilesOrderByField;
};

export type TorrentFilesQueryInput = {
  cached?: InputMaybe<Scalars["Boolean"]["input"]>;
  hasNextPage?: InputMaybe<Scalars["Boolean"]["input"]>;
  infoHashes?: InputMaybe<Array<Scalars["Hash20"]["input"]>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Array<TorrentFilesOrderByInput>>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
  totalCount?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type TorrentFilesQueryResult = {
  __typename?: "TorrentFilesQueryResult";
  hasNextPage?: Maybe<Scalars["Boolean"]["output"]>;
  items: Array<TorrentFile>;
  totalCount: Scalars["Int"]["output"];
};

export type TorrentListSourcesResult = {
  __typename?: "TorrentListSourcesResult";
  sources: Array<TorrentSource>;
};

export type TorrentMetricsBucket = {
  __typename?: "TorrentMetricsBucket";
  bucket: Scalars["DateTime"]["output"];
  count: Scalars["Int"]["output"];
  source: Scalars["String"]["output"];
  updated: Scalars["Boolean"]["output"];
};

export type TorrentMetricsQueryInput = {
  bucketDuration: MetricsBucketDuration;
  endTime?: InputMaybe<Scalars["DateTime"]["input"]>;
  sources?: InputMaybe<Array<Scalars["String"]["input"]>>;
  startTime?: InputMaybe<Scalars["DateTime"]["input"]>;
};

export type TorrentMetricsQueryResult = {
  __typename?: "TorrentMetricsQueryResult";
  buckets: Array<TorrentMetricsBucket>;
};

export type TorrentMutation = {
  __typename?: "TorrentMutation";
  delete?: Maybe<Scalars["Void"]["output"]>;
  deleteTags?: Maybe<Scalars["Void"]["output"]>;
  putTags?: Maybe<Scalars["Void"]["output"]>;
  reprocess?: Maybe<Scalars["Void"]["output"]>;
  setTags?: Maybe<Scalars["Void"]["output"]>;
};

export type TorrentMutationDeleteArgs = {
  infoHashes: Array<Scalars["Hash20"]["input"]>;
};

export type TorrentMutationDeleteTagsArgs = {
  infoHashes?: InputMaybe<Array<Scalars["Hash20"]["input"]>>;
  tagNames?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

export type TorrentMutationPutTagsArgs = {
  infoHashes: Array<Scalars["Hash20"]["input"]>;
  tagNames: Array<Scalars["String"]["input"]>;
};

export type TorrentMutationReprocessArgs = {
  input: TorrentReprocessInput;
};

export type TorrentMutationSetTagsArgs = {
  infoHashes: Array<Scalars["Hash20"]["input"]>;
  tagNames: Array<Scalars["String"]["input"]>;
};

export type TorrentQuery = {
  __typename?: "TorrentQuery";
  files: TorrentFilesQueryResult;
  listSources: TorrentListSourcesResult;
  metrics: TorrentMetricsQueryResult;
  suggestTags: TorrentSuggestTagsResult;
};

export type TorrentQueryFilesArgs = {
  input: TorrentFilesQueryInput;
};

export type TorrentQueryMetricsArgs = {
  input: TorrentMetricsQueryInput;
};

export type TorrentQuerySuggestTagsArgs = {
  input?: InputMaybe<SuggestTagsQueryInput>;
};

export type TorrentReprocessInput = {
  apisDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  classifierRematch?: InputMaybe<Scalars["Boolean"]["input"]>;
  classifierWorkflow?: InputMaybe<Scalars["String"]["input"]>;
  infoHashes: Array<Scalars["Hash20"]["input"]>;
  localSearchDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type TorrentSource = {
  __typename?: "TorrentSource";
  key: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
};

export type TorrentSourceAgg = {
  __typename?: "TorrentSourceAgg";
  count: Scalars["Int"]["output"];
  isEstimate: Scalars["Boolean"]["output"];
  label: Scalars["String"]["output"];
  value: Scalars["String"]["output"];
};

export type TorrentSourceFacetInput = {
  aggregate?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Array<Scalars["String"]["input"]>>;
  logic?: InputMaybe<FacetLogic>;
};

export type TorrentSourceInfo = {
  __typename?: "TorrentSourceInfo";
  importId?: Maybe<Scalars["String"]["output"]>;
  key: Scalars["String"]["output"];
  leechers?: Maybe<Scalars["Int"]["output"]>;
  name: Scalars["String"]["output"];
  seeders?: Maybe<Scalars["Int"]["output"]>;
};

export type TorrentSuggestTagsResult = {
  __typename?: "TorrentSuggestTagsResult";
  suggestions: Array<SuggestedTag>;
};

export type TorrentTagAgg = {
  __typename?: "TorrentTagAgg";
  count: Scalars["Int"]["output"];
  isEstimate: Scalars["Boolean"]["output"];
  label: Scalars["String"]["output"];
  value: Scalars["String"]["output"];
};

export type TorrentTagFacetInput = {
  aggregate?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Array<Scalars["String"]["input"]>>;
  logic?: InputMaybe<FacetLogic>;
};

export type Video3D = "V3D" | "V3DOU" | "V3DSBS";

export type VideoCodec =
  "DivX" | "H264" | "MPEG2" | "MPEG4" | "XviD" | "x264" | "x265";

export type VideoModifier =
  "BRDISK" | "RAWHD" | "REGIONAL" | "REMUX" | "SCREENER";

export type VideoResolution =
  | "V360p"
  | "V480p"
  | "V540p"
  | "V576p"
  | "V720p"
  | "V1080p"
  | "V1440p"
  | "V2160p"
  | "V4320p";

export type VideoResolutionAgg = {
  __typename?: "VideoResolutionAgg";
  count: Scalars["Int"]["output"];
  isEstimate: Scalars["Boolean"]["output"];
  label: Scalars["String"]["output"];
  value?: Maybe<VideoResolution>;
};

export type VideoResolutionFacetInput = {
  aggregate?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Array<InputMaybe<VideoResolution>>>;
};

export type VideoSource =
  | "BluRay"
  | "CAM"
  | "DVD"
  | "TELECINE"
  | "TELESYNC"
  | "TV"
  | "WEBDL"
  | "WEBRip"
  | "WORKPRINT";

export type VideoSourceAgg = {
  __typename?: "VideoSourceAgg";
  count: Scalars["Int"]["output"];
  isEstimate: Scalars["Boolean"]["output"];
  label: Scalars["String"]["output"];
  value?: Maybe<VideoSource>;
};

export type VideoSourceFacetInput = {
  aggregate?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Array<InputMaybe<VideoSource>>>;
};

export type Worker = {
  __typename?: "Worker";
  key: Scalars["String"]["output"];
  started: Scalars["Boolean"]["output"];
};

export type WorkersListAllQueryResult = {
  __typename?: "WorkersListAllQueryResult";
  workers: Array<Worker>;
};

export type WorkersQuery = {
  __typename?: "WorkersQuery";
  listAll: WorkersListAllQueryResult;
};
