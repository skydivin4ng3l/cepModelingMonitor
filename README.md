# CEPModeMon - Complex event Processing Monitoring & Modelling
CEPModeMon is a Prototype for a combined webapplication for modelling and monitoring Complex Event Processing Pipelines

<img src="examples/BasicGUI_2.png?raw=true" alt="Picture of the GUI" width="600" height="whatever">

## Requirements
Tested on Ubuntu 20.04 and Chrome 83  
[nodejs & npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)  
[dockercompose](https://docs.docker.com/compose/install/)


## Installation
In the root of CEPModeMon:
```shell script
npm install
```

## How to run
### Option 1: Modeling only
Start a simple kafka container
```shell script
cd testenvironment
docker-compose up --force-recreate kafka zookeeper 
```
Proceed with the **Start CEPModeMon**
##### For testing purposes:
The Pre-Processor can be started without **Data Collector** after all Event Streams are labeled within the model.
```shell script
cd testenvironment
docker-compose up cepmodemon
```

---

### Option 2: Modeling & Monitoring of CEPTA
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
<img src="examples/CEPMM_CEPTA_EPN.png?raw=true" alt="Model and Monitor Example" width="600" height="whatever"> 
##  Start CEPModeMon
In the root of CEPModeMon:
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
## Known Issues
* F5 refresh in Client will reset CEPModeMon Client but not the Webserver.
* Actions like rename of Stream labels or Load cannot be canceled.
* Continue Monitoring after a Stop will not reset the Old Monitoring Data.
* Zooming may influence insertion of new Elements, if not on neutral zoom level.
* If not all Streams get aggregate information the Pre-Processor might have missed the others on startup. Restart the Docker Environment.
* Chartjs labels might not work correctly.

## An example Architecture
CEPModeMons monitoring capabilities require an architecture like this: 

<img src="examples/HighlevelCEPModeMon.png?raw" alt="Architecture of CEPModeMon" width="600" height="whatever">  

This repository contains the Modelling and Monitoring Tool. It serves as a high level Consumer in the necessary Monitoring CEP Pipeline. Other components are necessary to get the Monitoring-Data and to pre-process the data before visualisation in CEPModeMon.

### CEPTA with Data Collector
Serves as high level Producer.  
The modified CEPTA version is located here: [CEPTA-with-DataCollector](https://github.com/bptlab/cepta/releases/tag/CEPModeMon)
### Pre-Processor
Serves as high level Event Processing Agent.    
The Pre-Processor is located here: [PreProcessor](https://github.com/skydivin4ng3l/CEPModeMon_prepro/releases/tag/v0.1.9)
or per Docker Container ```cepmodemon/prepro:v0.1.9```

## Available Modelling Components
Drag'n'drop-able atomic conceptional Consumers, Producers and mostly Event Processing Agentss.  
<img src="examples/allEPAs1.png?raw" alt="AllEPAs1" width="600" height="whatever">  
<img src="examples/allEPAs2.png?raw" alt="AllEPAs2" width="600" height="whatever">

For scale toggling or element deletion use the **+** on the upper left.

<img src="examples/EPAMenu.png?raw" alt="EPAMenu" width="300" height="whatever">


