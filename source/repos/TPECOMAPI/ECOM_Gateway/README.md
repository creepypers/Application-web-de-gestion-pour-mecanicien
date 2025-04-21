# ECOM_Gateway

API Gateway for the TPECOM Microservices Architecture using Ocelot and Swagger.

## Overview

This API Gateway serves as the entry point for all client applications accessing the various microservices in the TPECOM platform. It provides a unified interface by routing requests to the appropriate microservice based on the request path.

## Architecture

The gateway routes to the following microservices:

- Users Service (Utilisateurs): http://localhost:8001
- Products Service (Produits): http://localhost:8002
- Cart Service (Panier): http://localhost:8003
- Orders Service (Commandes): http://localhost:8004
- Payment Service (Paiement): http://localhost:8005

## API Routes

All API routes follow the pattern:

- `/api/users/{endpoint}` → Routes to the Users Service
- `/api/products/{endpoint}` → Routes to the Products Service
- `/api/cart/{endpoint}` → Routes to the Cart Service
- `/api/orders/{endpoint}` → Routes to the Orders Service
- `/api/payment/{endpoint}` → Routes to the Payment Service

## Swagger Documentation

Swagger UI is available at: http://localhost:8000/swagger

## Configuration

The Gateway configuration is split between:

- `ocelot.json`: Main Ocelot configuration
- `Routes/*.json`: Individual route configurations for each microservice

## Running the Gateway

```bash
dotnet run
```

The Gateway will be available at http://localhost:8000 