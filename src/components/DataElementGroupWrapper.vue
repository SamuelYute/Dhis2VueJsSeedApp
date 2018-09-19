<template>
    <div>
       <DataElementGroup
               v-for="(dataElementGroup, index) in dataElementGroups"
               v-bind:groupName="dataElementGroup.name"
               v-bind:groupDataElements="dataElementGroup.dataElements"
               v-bind:index="index"
               v-bind:key="dataElementGroup.name"
               v-bind:totalComparisonValue="totalComparisonValue"
       />
    </div>
</template>

<script>
    import authResource from './../authResource'
    import DataElementGroup from '@/components/DataElementGroup.vue'
    import _ from 'lodash'

    export default {
        name: 'DataElementGroupWrapper',
        methods: {

            initialize : function()
            {
                this.getInitialData();
                this.retrieveDataElementIDs();
                this.getDataElements();
                this.retrieveDataElementGroups();
            },

            getInitialData : function ()
            {
                this.isLoading = true;

                authResource().get(this.BASE_URL)
                    .then((response)=>{
                        this.isLoading = false;
                        sessionStorage.setItem('dataValues',JSON.stringify(response.data.dataValues))
                    })
                    .catch((error)=>{
                        this.isLoading = false;

                        this.response  = error;
                    })
            },

            retrieveDataElementIDs: function ()
            {
                let dataValues =  JSON.parse(sessionStorage.getItem('dataValues'));
                this.dataElementIDs = _.map(dataValues, 'dataElement');
            },

             getDataElements: function ()
            {
                let dataElementIDsString = this.dataElementIDs.join();
                let dhisApiEndpoint = `${this.dataElements_URL}?filter=id:in:[${dataElementIDsString}]&fields=id,displayName,formName,description,dataElementGroups`;

                authResource().get(dhisApiEndpoint)
                                .then((response) => {
                                    this.dataElements.push(..._.slice(response.data.dataElements,1,19));
                                })
                                .catch((error) => {
                                    console.log(error);
                                })
            },

            retrieveDataElementGroups: function ()
            {
                this.dataElementGroups.push(...
                                            _.chain(this.dataElements)
                                            .groupBy("description")
                                            .toPairs()
                                            .map(pair => _.zipObject(['name', 'dataElements'], pair))
                                            .value());

            },

            calculateTotalComparisonValue: function ()
            {
                let dataValueSets = JSON.parse(sessionStorage.getItem('dataValues'));
                let totals = [];

                for(var i = 0; i < this.dataElementGroups.length; i++)
                {
                    let dataElements = this.dataElementGroups[i].dataElements;

                    totals.push( _.chain(dataValueSets)
                            .filter((item) => {
                                return _.includes(_.map(dataElements, 'id'), item['dataElement']);
                            }).map('value')
                            .value()
                            .reduce((sum,number) => {return Number(sum)+Number(number)}));

                    console.log(totals)
                }

                return this.getCommonTotalValue(totals);

            },

            getCommonTotalValue : function(totals)
            {
                    var mode = [], count = [], i, total, maxIndex = 0;

                    for (i = 0; i < totals.length; i += 1) {
                        total = totals[i];
                        count[total] = (count[total] || 0) + 1;
                        if (count[total] > maxIndex) {
                            maxIndex = count[total];
                        }
                    }

                    for (i in count)
                        if (count.hasOwnProperty(i)) {
                            if (count[i] === maxIndex) {
                                mode.push(Number(i));
                            }
                        }

                    return mode[0];
            }

        },
        mounted()
        {
            this.initialize()
        },
        data: () => {
            return {
                BASE_URL : 'http://demo.dhis.org/api/dataValueSets.json?orgUnit=123456&period=201808&dataSet=123456',
                dataElements_URL : 'http://demo.dhis.org/api/dataElements.json',

                isLoading : false,
                response : null,

                dataElementIDs : [],

                dataElements : [],

                dataElementGroups : []
            }
        },
        computed : {
            totalComparisonValue : function()
            {
                  return this.calculateTotalComparisonValue();
            }
        },
        watch :  {
            dataElements :  function()
            {
                this.retrieveDataElementGroups();
            }
        },
        components : {
            DataElementGroup,
        }
    }
</script>
