#!/bin/bash

# This script runs when user install the debian package

# Link to the binary
ln -sf '/opt/${productFilename}/${executable}' '/usr/local/bin/${executable}';
echo 'Successfully added /opt/${productFilename}/${executable} to /usr/local/bin/${executable}'