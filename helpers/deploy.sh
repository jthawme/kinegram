#!/bin/bash

cp context/app.yaml dist/app.yaml

# If AppEngine
gcloud config set account hi@jthaw.me
gcloud config set project kinegram
gcloud app deploy dist/app.yaml