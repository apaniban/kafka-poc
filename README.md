# kafka-poc
This uses `kafkajs` as kafka client to connect to brokers, and wrapping those methods in Observables (`rxjs`) for ease of composing stream operations.

## Install dependencies for producer and consumer
```
  cd consumer && yarn
  cd producer && yarn
```

## Run kafka in local
```
export HOST_IP=$(ifconfig | grep -E "([0-9]{1,3}\.){3}[0-9]{1,3}" | grep -v 127.0.0.1 | awk '{ print $2 }' | cut -f2 -d: | head -n1)
docker-compose up
```

## Run Producer
```node producer```

## Run Consumer
```node consumer```
