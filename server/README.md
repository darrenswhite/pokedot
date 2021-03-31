# Pokédot Server

## Setup

Create a `.env` file from the example file and enter the required values.

```
cp .env.example .env
```

## Running locally

Install dependencies.

```
npm i
```

Run the server.

```
npm run dev
```

## Running in production (Docker)

```
docker build -t pokedot-server .

docker run --rm --env-file .env -p 8080:8080 --name pokedot-server pokedot-server
```
