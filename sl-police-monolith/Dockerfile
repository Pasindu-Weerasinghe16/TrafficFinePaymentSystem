# Global ARG - must be before any FROM to use in FROM
ARG SPRING_BOOT_BASE_IMAGE=eclipse-temurin:21-jre-alpine

# Build stage
FROM maven:3.9-eclipse-temurin-21-alpine AS builder
WORKDIR /build
# Download all dependencies as a separate cached layer (only reruns if pom.xml changes)
COPY pom.xml .
RUN mvn dependency:go-offline -B
# Copy sources and build (uses cached .m2 from step above)
COPY src ./src
RUN mvn clean package -DskipTests

# Runtime stage
FROM ${SPRING_BOOT_BASE_IMAGE}
WORKDIR /workspace
COPY --from=builder /build/target/*.jar app.jar
EXPOSE 8081
CMD ["java", "-jar", "app.jar"]
