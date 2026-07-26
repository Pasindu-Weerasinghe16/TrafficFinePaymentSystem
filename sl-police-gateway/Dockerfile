ARG SPRING_BOOT_BASE_IMAGE=eclipse-temurin:25-jre-alpine
FROM maven:3.9-eclipse-temurin-21-alpine AS builder
WORKDIR /build
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

FROM ${SPRING_BOOT_BASE_IMAGE}
WORKDIR /workspace
COPY --from=builder /build/target/*.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
