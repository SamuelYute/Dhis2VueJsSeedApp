<template>
    <div>
        <div class="shadow-md hover:shadow-lg border border-teal-light rounded py-4 my-4">
            <h2 class="my-3 mx-3 font-medium">
                {{name}}
            </h2>
            <DataElement
                    class="px-5"
                    v-for="(dataElement, index) in dataElements"
                    v-bind:DEId="dataElement.id"
                    v-bind:DEFormName = "dataElement.formName"
                    v-bind:DEDisplayName = "dataElement.displayName"
                    v-bind:index="index"
                    v-bind:key="dataElement.id"
                    v-on:emitDataValue="updateDataElementGroupValueSet"
            ></DataElement>
            <div class="border border-grey my-2"></div>
            <div class="row px-4 py-1">
                <div class="col">
                   <h3>Total</h3>
                </div>
                <div class="col-3">
                   <span v-if="isValidTotal" class="text-green font-bold">Valid!</span>
                   <span v-if="!isValidTotal" class="text-red font-bold">Invalid</span>
                </div>
                <div class="col-3">
                    {{total}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import DataElement from '@/components/DataElement.vue'
    import _ from 'lodash'

    export default {
        name: 'DataElementGroup',
        props: [ 'groupName', 'groupDataElements', 'totalComparisonValue'],
        methods : {
          setData : function ()
          {
            this.name = this.groupName;
            this.dataElements.push(...this.groupDataElements);
            this.dataElementValueSets.push(...this.getDataValueSets())
          },
            getDataValueSets : function ()
            {
                let dataValueSets =  JSON.parse(sessionStorage.getItem('dataValues'));

                return _.filter(dataValueSets, (item) => {
                    return _.includes(_.map(this.dataElements, 'id'), item['dataElement']);
                });
            },
            updateDataElementGroupValueSet : function (newDataSet)
            {
                var valueSets = this.dataElementValueSets;

                this.dataElementValueSets = _.map(valueSets, function(dataSet) {
                    if (dataSet.dataElement === newDataSet.dataElement)
                        return newDataSet;
                    return {dataElement : dataSet.dataElement, value : dataSet.value};
                })
            },
            calculateTotal :  function ()
            {
                let sum = 0;
                for(var i = 0; i < this.dataElementValueSets.length; i++)
                {
                    sum = sum+Number(this.dataElementValueSets[i].value)
                }

               return sum;
            }
        },
        data: () => {
            return {
                name : "",
                dataElements : [],
                dataElementValueSets : [],
                total : 0
            }
        },
        mounted()
        {
          this.setData()
        },
        components : {
            DataElement
        },
        computed : {
          isValidTotal : function ()
          {
            return this.totalComparisonValue === this.total;
          }
        },
        watch : {
            groupName : function(value)
            {
                this.name = value;
            },
            groupDataElements : function(value)
            {
                this.dataElements.push(...value);
            },
            dataElementValueSets : function ()
            {
                this.total = this.calculateTotal();
            }
        }
    }
</script>
