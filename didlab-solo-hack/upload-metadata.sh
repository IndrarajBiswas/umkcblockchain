#!/bin/bash
JWT=$(jq -r .token jwt-response.json)
curl -sS -X POST https://api.didlab.org/v1/ipfs/upload \
  -H "Authorization: Bearer $JWT" \
  -F "file=@metadata.json" \
  -F "pin=true"
