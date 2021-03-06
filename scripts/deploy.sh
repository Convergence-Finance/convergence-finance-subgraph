#!/bin/sh

if [ -z "$1" ]; then
  echo "Path not set. Usage: ./codegen.sh PATH"
  exit 1
fi

yarn envsub $1/subgraph.yaml $1/subgraph.temp.yaml

mv ./subgraphs/common/envVars.ts ./subgraphs/common/envVars.ts.backup
yarn envsub ./subgraphs/common/envVars.ts.backup ./subgraphs/common/envVars.ts

yarn graph deploy \
    --node ${DEPLOY_URL} \
    --ipfs ${IPFS_URL} \
    --access-token ${ACCESS_TOKEN} \
    ${SUBGRAPH_NAME} \
    $1/subgraph.temp.yaml

mv ./subgraphs/common/envVars.ts.backup ./subgraphs/common/envVars.ts
