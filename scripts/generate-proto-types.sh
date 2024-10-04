#!/bin/bash

PROTO_OUT=./src/types

mkdir -p ${PROTO_OUT}

npx --yes @protobuf-ts/protoc \
  --plugin=./node_modules/.bin/protoc-gen-ts_proto \
  --ts_proto_opt=esModuleInterop=true,outputClientImpl=false \
  --ts_proto_out=${PROTO_OUT} \
  --proto_path=./proto \
  ./proto/*.proto