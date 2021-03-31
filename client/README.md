# Pokédot Client

Create a `.env.local` file from the example file and enter the required values.

```
cp .env.example .env.local
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

Build and run the container.

```
docker build -t pokedot-client .

docker run --rm -p 3000:3000 --name pokedot-client pokedot-client
```
