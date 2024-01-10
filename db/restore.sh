#!/bin/bash

default_path="dump.sql"

# Check if the parameter is provided, otherwise use the default
if [ -z "$1" ]; then
  path="$default_path"
else
  path="$1"
fi

psql -U weppo_admin -d weppo_shop < "$path"