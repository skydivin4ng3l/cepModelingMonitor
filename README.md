# CEPModeMon - Complex event Processing Monitoring & Modelling
CEPModeMon is a Prototype for a combined webapplication for modelling and monitoring Complex Event Processing Pipelines

<img src="examples/BasicGUI_2.png?raw=true" alt="Picture of the GUI" width="400" height="whatever">

## Requirements
Tested on Ubuntu 20.04 and Chrome 83  
[nodejs & npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)  
[dockercompose]()


## Installation
```shell script
npm install
```

## How to run
### Modeling only
Start a simple kafka container
```shell script
cd testenvironment
docker-compose up --force-recreate kafka zookeeper 
```
Proceed with the **Start CEPModeMon**

---

### Modeling & monitoring of CEPTA
Clone CEPTA Monitoring Version and configure your Mongo Database connection (TrainData) for the Replayer.
```shell script
git clone --depth 1 --branch CEPModeMon git@github.com:bptlab/cepta.git
cd cepta
```
Start your prepared Mongo DB Container as State (optional) with Replay collection with station data
```shell script
./deployment/dev/devenv.sh up mongo 
```
 Build CEPTA Images and Run CEPTA Core in Docker
 ```shell script
 BUILD=1 ./deployment/dev/devenv.sh up --force-recreate kafka zookeeper kafdrop cepmodemon
```
When Kafdrop Broker is reachable on [http://localhost:9001/](http://localhost:9001/) proceed with the **Start of CEPModeMon** and continue here

2. In CEPModeMon click "Load"
3. Choose ```./examples/CEPTA.json```
4. In CEPModeMon click "Start Monitoring"
1. Start the CEPTA Replayer (replace ```--mongo-port ``` option with your Datasource for TrainData ) 
```shell script
bazel run //auxiliary/producers/replayer:replayer --port 8083 --replay-log debug --pause 100 --mode proportional --no-repeat --mongodb-port 27018 --immediate --include-sources PLANNED_TRAIN_DATA,LIVE_TRAIN_DATA
``` 
Now you should see after a while that the line charts display the aggregated Event Count (per 5 second windows) on the Event Streams and individual Events along the Event Streams, like this:
<img src="examples/CEPMM_CEPTA_EPN.png?raw=true" alt="Model & Monitor Example" width="200" height="whatever"> 
##  Start CEPModeMon
```shell script
npm run start
```
In Chrome head to [http://localhost:3000/](http://localhost:3000/)

enjoy!
## Requirements for Development
[nodemon](https://nodemon.io/)
```shell script
npm install -g nodemon
```
For rebuilding protobuf schemas you need to install [protoc](https://github.com/protocolbuffers/protobuf/tree/master/js) to run:
```shell script
npm run build_proto
```

## Example Architecture
CEPModeMons monitoring capabilities require an architecture like this:
<img src="examples/HighlevelCEPModeMon.png?raw" alt="Architecture of CEPModeMon" width="400" height="whatever">

This repository contains the Modelling and Monitoring Tool. It serves as a consumer in the necessary Monitoring CEP Pipeline. Other components are necessary to get the Monitoring-Data and to preprocess the data before visualisation in CEPModeMon.

### CEPTA version with Data Collector
The modified CEPTA version is located here: [CEPTA-with-DataCollector](https://github.com/bptlab/cepta/releases/tag/CEPModeMon)
### Pre-Processor
The Pre-Processor is located here: [PreProcessor](https://github.com/skydivin4ng3l/CEPModeMon_prepro/releases/tag/v0.1.9)
or per Docker Container ```cepmodemon/prepro:v0.1.9```




