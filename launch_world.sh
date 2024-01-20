#!/bin/sh
export CLASSPATH=".:dist/*:lib/*"

echo "世界伺服器"$1"號"

if test "$#" -ne 1; then
    echo "./launch_world.sh <worldId>"
else
    # Generate self-signed keystore if not exists
    if [ ! -f filename.keystore ]; then
        echo "No filename.keystore found. Generating self-signed keystore dynamically..."
        keytool -genkeypair \
          -alias sslKey \
          -keyalg RSA \
          -keysize 2048 \
          -validity 365 \
          -keypass passwd \
          -storepass passwd \
          -keystore filename.keystore \
          -dname "CN=localhost, OU=BiosMS, O=BiosSystem, L=Unknown, S=Unknown, C=US"
    fi

    java -Xmx600m \
        -Drecvops=recvops.properties \
        -Dsendops=sendops.properties \
        -Dwzpath=wz/ \
        -Dworld.worldId=$1 \
        -Djavax.net.ssl.keyStore=filename.keystore \
        -Djavax.net.ssl.keyStorePassword=passwd \
        -Djavax.net.ssl.trustStore=filename.keystore \
        -Djavax.net.ssl.trustStorePassword=passwd \
        -server net.world.WorldServer
fi
