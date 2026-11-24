import type { CodegenConfig } from "@graphql-codegen/cli";

const scalars = {
  Date: "string",
  DateTime: "string",
  Duration: "string",
  Hash20: "string",
  Void: "void",
  Year: "number",
};

const config: CodegenConfig = {
  schema: "graphql/schema/**/*.graphqls",
  documents: [
    "graphql/fragments/*.graphql",
    "graphql/queries/*.graphql",
    "graphql/mutations/*.graphql",
  ],
  generates: {
    "src/lib/graphql/schema-types.ts": {
      plugins: ["typescript"],
      config: {
        enumsAsTypes: true,
        scalars,
      },
    },
    "src/lib/graphql/generated.ts": {
      plugins: ["typescript-operations", "typed-document-node"],
      config: {
        enumsAsTypes: true,
        skipTypename: false,
        importSchemaTypesFrom: "./src/lib/graphql/schema-types",
        scalars,
      },
    },
  },
  hooks: {
    afterAllFileWrite: ["prettier --write"],
  },
};

export default config;
