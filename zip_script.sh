#!/bin/bash

# Step 1: Extract the version from manifest.json
VERSION=$(jq -r '.version' manifest.json)

# Check if the version was extracted successfully
if [ -z "$VERSION" ]; then
  echo "Error: Could not extract version from manifest.json"
  exit 1
fi

echo "Version extracted: $VERSION"

# Step 2: Define the files to be included in the zip file
# You can use either a whitelist or a blacklist approach. Here, I'll use a whitelist approach for clarity.

# Create a list of files to include in the zip
FILES_TO_INCLUDE=(
  "manifest.json"
  "components"
  "popup"
  "shared"
  "options"
  "license"
  "icons"
)

# Step 3: Create the zip file with the extracted version name
ZIP_FILENAME="addon-$VERSION.zip"

# Use the zip command to create the zip file
zip -r "$ZIP_FILENAME" "${FILES_TO_INCLUDE[@]}"

# Check if the zip command was successful
if [ $? -eq 0 ]; then
  echo "Zip file created successfully: $ZIP_FILENAME"
else
  echo "Error: Failed to create zip file"
  exit 1
fi
