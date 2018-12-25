#!/bin/bash

cp context/app.yaml dist/app.yaml

# If AppEngine
# gcloud config set account [USER]
# gcloud config set project [PROJECT]
# gcloud app deploy dist/app.yaml