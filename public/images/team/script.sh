#!/usr/bin/bash

mkdir -p ./raw
mkdir -p ./remove-bg
mkdir -p ./face-crop

uvx face-crop-plus -i ./remove-bg -o ./face-crop --output-size 512 512 --face-factor 0.5 --device cuda
uvx rembg p ./face-crop ./remove-bg
mv ./remove-bg/* .