# Stage 1: Build Java source using Maven
FROM maven:3.8.5-openjdk-8 AS build
WORKDIR /app

# Copy pom.xml and resolve dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy src and compile
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Create lightweight running image
FROM openjdk:8-jre-slim
WORKDIR /app

# Install gettext for envsubst if needed (useful for dynamic properties configuration)
RUN apt-get update && apt-get install -y gettext-base && rm -rf /var/lib/apt/lists/*

# Copy build outputs from build stage
COPY --from=build /app/target/dist ./dist
COPY --from=build /app/target/lib ./lib

# Copy configuration, scripting, and properties directories
COPY configs ./configs
COPY scripts ./scripts
COPY logging.properties .
COPY *.properties ./

# Copy and prepare the dynamic keystore entrypoint script
COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

# Mount points for MapleStory WZ XML asset files
RUN mkdir -p /app/wz

# Create a non-root user and set permissions
RUN groupadd -g 10001 appgroup && useradd -u 10001 -g appgroup -m appuser && chown -R appuser:appgroup /app
USER appuser

# Expose server ports:
# Login Server: 8484
# Channel Server: 7575 - 7580
# World Server: 8585
EXPOSE 8484 7575 7576 7577 7578 7579 7580 8585

ENTRYPOINT ["/app/entrypoint.sh"]

# Define command to run Login server by default (can be overridden to Channel/World Server)
CMD ["java", "-Xmx512m", "-Drecvops=recvops.properties", "-Dsendops=sendops.properties", "-Dwzpath=wz/", "-Dlogin.config=configs/login.properties", "-Djavax.net.ssl.keyStore=filename.keystore", "-Djavax.net.ssl.keyStorePassword=passwd", "-Djavax.net.ssl.trustStore=filename.keystore", "-Djavax.net.ssl.trustStorePassword=passwd", "-cp", "dist/*:lib/*", "net.login.LoginServer"]
