#!/bin/sh
set -e

# Generate self-signed keystore if not exists
if [ ! -f /app/filename.keystore ]; then
    echo "No filename.keystore found. Generating self-signed keystore dynamically using keytool..."
    keytool -genkeypair \
      -alias sslKey \
      -keyalg RSA \
      -keysize 2048 \
      -validity 365 \
      -keypass passwd \
      -storepass passwd \
      -keystore /app/filename.keystore \
      -dname "CN=localhost, OU=BiosMS, O=BiosSystem, L=Unknown, S=Unknown, C=US"
fi

# Execute the container command
exec "$@"
