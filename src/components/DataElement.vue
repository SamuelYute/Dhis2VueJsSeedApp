<template>
    <div class="container py-2">
        <div class="row">
            <div class="col">
                <label :for="id">{{displayName}} </label>
            </div>
            <div class="col-3">
                <input   :id="id"
                        class="bg-grey-lighter
                                appearance-none
                                 border-2
                                  border-grey-lighter
                                   rounded
                                    w-full
                                     py-2
                                      px-4
                                       text-grey-darker
                                        leading-tight
                                         focus:outline-none
                                          focus:bg-white
                                           focus:border-teal" type="number" v-model="dataValue" v-on:input="emitDataValue">
            </div>
        </div>
    </div>
</template>

<script>
    import _ from 'lodash'

    export default {
        name: 'DataElement',
        props: [ 'DEId', 'DEFormName', 'DEDisplayName'],
        mounted(){
          this.setDataValue();
        },
        methods: {
            setDataValue : function()
            {
                let dataValues = JSON.parse(sessionStorage.getItem('dataValues'));

                this.dataValue = _.find(dataValues, ['dataElement', this.id]).value;
            },
          emitDataValue : function()
          {
              this.$emit('emitDataValue', { dataElement : this.id, value : this.dataValue})
          }
        },
        data : function()
        {
            return {
                dataValue : 0
            }
        },
        computed : {
            id : function()
            {
                return this.DEId;
            },
            formName : function()
            {
               return this.DEFormName;
            },
            displayName : function()
            {
               return this.DEDisplayName;
            }
        },
        watch : {
            id : function()
            {
                this.setDataValue();
            }
        }
    }
</script>
