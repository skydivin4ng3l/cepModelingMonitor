# CEPModeMon - Complex event Processing Monitoring & Modelling
CEPModeMon is a Proof of Concept for a combined webapplication for modelling and monitoring Complex Event Processing Pipelines

<img src="examples/BasicGUI_2.png?raw=true" alt="Picture of the GUI" width="400" height="whatever">

## Example Architecture
CEPModeMons monitoring capabilities are dependant on a Monitoring-Data producer for Kafka
<img src="examples/HighlevelCEPModeMon.png?raw" alt="Architecture of CEPModeMon" width="400" height="whatever">

This repository contains the Modelling and Monitoring Tool. It serves as a consumer in the necessary Monitoring CEP Pipeline.
### Pre-Processor
The Pre-Processor is located here: [PreProcessor](https://github.com/skydivin4ng3l/CEPModeMon_prepro/releases/tag/v0.1.9)
or per Docker Container ```cepmodemon/prepro:v0.1.9```

### CEPTA version with Data Collector
The modified CEPTA version is located here: [PreProcessor](https://github.com/bptlab/cepta/releases/tag/CEPModeMon)
