#!/bin/bash
set -eu
redis-cli hset test:redish:h hostname 192.168.0.1 | grep -q '^[0-1]$'
redis-cli hset test:redish:h port 22 | grep -q '^[0-1]$'
redis-cli hset test:redish:h createdAt 1630148367210 | grep -q '^[0-1]$'

redish() {
  if [ ${#} -eq 0 ] 
  then
    echo "> redish"
    deno run --allow-net=127.0.0.1:6379 main.ts
  else
    echo "> redish" "${@}"
    deno run --allow-net=127.0.0.1:6379 main.ts "${@}"
  fi
  echo
}

echo
redish test:redish:h
redish test:redish:h createdAt
redish
