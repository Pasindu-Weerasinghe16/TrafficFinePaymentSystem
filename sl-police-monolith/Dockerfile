# Build stage
FROM maven:3.9-eclipse-temurin-25-alpine AS builder
WORKDIR /build
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Runtime stage
ARG SPRING_BOOT_BASE_IMAGE=eclipse-temurin:25-jre-alpine
FROM ${SPRING_BOOT_BASE_IMAGE}
WORKDIR /workspace
COPY --from=builder /build/target/*.jar app.jar
EXPOSE 8082
CMD ["java", "-jar", "app.jar"]
