#!/bin/bash

default_path="dump.sql"

# Check if the parameter is provided, otherwise use the default
if [ -z "$1" ]; then
  path="$default_path"
else
  path="$1"
fi

pg_dump -U weppo_admin weppo_shop > "$path"