# Build stage
FROM maven:3.8.4-openjdk-17-slim AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
COPY Wallet_DF3 /app/Wallet_DF3
ENV TNS_ADMIN=/app/Wallet_DF3
ENV PATH=/app/Wallet_DF3:$PATH
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"] 