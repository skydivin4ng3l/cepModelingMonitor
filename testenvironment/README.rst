Start Test Datageneration
===========

* Go to ``testenvironment/`` and start all services

  .. code-block:: bash

    docker-compose up --force-recreate

  *Wait for Kafka Broker and Kafka Connect cluster to be fully started.*

    * Check http://localhost:8000 to see the Broker UI
    * Check http://localhost:8001 to see the Connect UI

* Create data generation task

  .. code-block:: bash

    curl -X POST http://localhost:8083/connectors \
    -H 'Content-Type:application/json' \
    -H 'Accept:application/json' \
    -d @connect.source.datagen.json | jq

* Based on the configurations, you should observe from Broker UI that

  * messages are being published to topic ``test`` at rate of 10 every 5 seconds
  * every message is randomized over ``status`` and ``direction`` fields
  * every message contains a timestamp field ``event_ts``

* Go to Connect UI, select the "datagen" connector and click "PAUSE" or "DELETE".
