# Installation Typesence and MongoDB

- **For cloud or self-hosted**:
  - **Install Typesense**: Please follow [This guide](https://typesense.org/docs/guide/install-typesense.html).
  - **Install MongoDB**: Please follow [This guide](https://www.mongodb.com/docs/).

- **Setup replica set for MongoDB**:
  - Option 1: [Deploy replica set on MongoDB cloud](https://www.mongodb.com/docs/cloud-manager/tutorial/deploy-replica-set/) (If you use MongoDB Cloud).
  - Option 2: [Setup replica set on MongoDB self-hosted](https://www.mongodb.com/docs/manual/replication/) (If you use MongoDB Self-hosted).

- **For docker compose**: You could follow the steps below to quick installation.

1. **Config your environment**:

   Create a `.env` at root your project and copy those variables below to your `.env` file:

   MongoDB variables environment:

   ```env
    # MongoDB config
    MONGO_BD_NAME='your mongoDB database name'
    MONGO_USERNAME='your mongoDB username'
    MONGO_PASSWORD='your mongoDB password'
    MONGO_PORT=27017
    MONGO_HOST='your mongoDB host'
   ```

   Typesense variables environment:

   ```env
    # typesense config
    TYPESENSE_HOST='your Typesense host'
    TYPESENSE_PORT=8108
    TYPESENSE_PROTOCOL=http
    TYPESENSE_API_KEY='your api key'
   ```

   Notice: You can run command `openssl rand -hex 32` to generate your api key.

2. **Docker compose config file**:

   Create a new `docker-conpose.yml` at your root project. You can use full config defined at [docker-conpose.yml](./docker-conpose.yml) file.

   __Define your network:__

   ```yaml
   # docker-compose.yml
   ...
   networks:
       your_network_name:
           driver: bridge
   ...
   ```

   __Define Dockerfile for MongoDB__:

   You should create a new `Dockerfile` file at `.docker/mongo/` directory.

   ```dockerfile
   # .docker/mongo/Dockerfile
   
   FROM mongo:latest
   RUN openssl rand -base64 756 > /etc/mongo-keyfile
   RUN chmod 400 /etc/mongo-keyfile
   RUN chown mongodb:mongodb /etc/mongo-keyfile
   ```

   The configurations above will create a new key to prepare setup __Replica Set__ for MongoDB.

   __A MongoDB replica set__ is necessary for our system because it allows us to listen to data stream changes from MongoDB. This capability is crucial for updating new data to Typesense in real-time.

   __Define mongo service__:

   ```yaml
   # docker-compose.yml
   ...
   services:
      mongo:
          build:
              dockerfile: .docker/mongo/Dockerfile
          container_name: typesence-mongo-db
          restart: always
          environment:
              MONGO_INITDB_ROOT_USERNAME: $MONGO_USERNAME
              MONGO_INITDB_ROOT_PASSWORD: $MONGO_PASSWORD
          ports:
              - '${MONGO_PORT}:27017'
          command: --replSet rs0 --keyFile /etc/mongo-keyfile --bind_ip_all --port $MONGO_PORT
          healthcheck:
              test: echo "
                  try { rs.status() }
                  catch (err) {
                      rs.initiate({
                          _id:'rs0',
                          members:[{ _id:0, host:'127.0.0.1:27017' }]
                      })
                  }" | mongosh --port $MONGO_PORT -u $MONGO_USERNAME -p $MONGO_PASSWORD --authenticationDatabase admin
              interval: 5s
              timeout: 15s
              start_period: 15s
              retries: 10
          networks:
              - your_network_name
          volumes:
              - mongo-data:/data/db
   ...
   ```

   ___Notice:___ The scripts bellow to check and register replica set members to MongoDB.

   ```js
   try { rs.status() }
   catch (err) {
      rs.initiate({
          _id:'rs0',
          members:[{ _id:0, host:'127.0.0.1:27017' }]
      })
   }
   ```

   __Define Typesense service:__

   ```yaml
   # docker-compose.yml
   ...
       typesense:
          image: typesense/typesense:27.0.rc2
          container_name: typesense-data-search
          ports:
              - '${TYPESENSE_PORT}:8108'
          volumes:
              - typesense-data:/data
          command: '--data-dir /data --api-key=${TYPESENSE_API_KEY} --enable-cors'
          networks:
              - your_network_name
   ...
   ```

   __Register volumns:__

   ```yaml
   # docker-compose.yml
   ...
       volumes:
           mongo-data:
           typesense-data:
   ...
   ```

3. **Run docker compose**:

   - Start your docker.
  
   - Run docker compose:

     ```sh
     docker compose --env-file .env up -d
     ```
  
   - Check your services are running or not:
  
     ```sh
     docker ps
     ```
