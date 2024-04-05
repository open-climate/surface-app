# cdm-etl

The Climate Data Model - Extract Transform Load (CDM-ETL) component can be used with any Climate Data Management System (CDMS) that implements the Climate Data Model API that is under development by the WMO Task Team on Climate Data Model (TT-CDM). See [OpenCDMS](http://github.com/opencdms/opencdms) for a Reference Implementation of the Climate Data Model Standard and Climate Data Model API.

CDM-ETL allow you to:
1. **Extact** data from any system implementing the CDM APIs
2. **Transform** the data by passing it to a OGC API Processes process
3. **Load** the data by specifying where/how you want the resulting output

The CDM-ETL repository will contain:
1. A reuseable web componet (developed with Vuetify 3), available from npm
2. A reusable OGC API - Processes process (developmed with Python 3), available from PyPI
3. Documentation
4. Tests
